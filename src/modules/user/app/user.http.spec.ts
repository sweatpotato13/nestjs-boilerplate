import { generateKeyPairSync } from "node:crypto";

import { INestApplication, ValidationPipe } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { Test } from "@nestjs/testing";
import { JwtService } from "@shared/modules/jwt/jwt.service";
import jwt from "jsonwebtoken";
import request from "supertest";

import { CommandHandlers } from "../domain/commands/handlers";
import { QueryHandlers } from "../domain/queries/handlers";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

describe("User HTTP authorization", () => {
    let app: INestApplication;
    const keys = generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" }
    });
    const jwtService = new JwtService({
        ...keys,
        algorithm: "RS256",
        accessExpiresIn: 60,
        refreshExpiresIn: 3600
    });
    const tokens = jwtService.createUserJwt("user-123");
    const user = {
        id: "user-123",
        name: "John",
        email: "john@example.com",
        provider: "google",
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const prisma = { user: { findFirst: jest.fn() }, $transaction: jest.fn() };

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [CqrsModule],
            controllers: [UserController],
            providers: [
                { provide: "UserService", useClass: UserService },
                { provide: "JwtService", useValue: jwtService },
                { provide: "PrismaService", useValue: prisma },
                ...QueryHandlers,
                ...CommandHandlers
            ]
        }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });
    beforeEach(() => prisma.user.findFirst.mockResolvedValue(user));
    afterAll(async () => {
        await app.close();
    });

    it.each(["/users?email=john@example.com", "/users/user-123"])(
        "rejects anonymous reads of %s",
        async path => {
            await request(app.getHttpServer()).get(path).expect(401);
            expect(prisma.user.findFirst).not.toHaveBeenCalled();
        }
    );

    it.each([
        tokens.accessToken,
        `Basic ${tokens.accessToken}`,
        `Bearer ${tokens.refreshToken}`,
        "Bearer invalid",
        `Bearer ${jwtService.signJwt({ userId: "user-123" }, true)}`,
        `Bearer ${jwtService.signJwt({ type: "accessToken" }, true)}`,
        `Bearer ${jwtService.signJwt({ type: "accessToken", userId: 123 }, true)}`,
        `Bearer ${jwt.sign(
            { userId: "user-123", type: "accessToken" },
            keys.privateKey,
            { algorithm: "RS256", expiresIn: -1 }
        )}`
    ])("rejects invalid authorization case %#", async authorization => {
        await request(app.getHttpServer())
            .get("/users/user-123")
            .set("Authorization", authorization)
            .expect(401);
        expect(prisma.user.findFirst).not.toHaveBeenCalled();
    });

    it("returns only the authenticated user's documented fields", async () => {
        await request(app.getHttpServer())
            .get("/users/user-123")
            .set("Authorization", `Bearer ${tokens.accessToken}`)
            .expect(200, {
                result: "OK",
                user: { id: user.id, name: user.name, email: user.email }
            });
        expect(prisma.user.findFirst).toHaveBeenCalledWith({
            where: { id: user.id },
            select: { id: true, name: true, email: true }
        });
    });

    it("rejects another user's ID before querying the database", async () => {
        await request(app.getHttpServer())
            .get("/users/another-user")
            .set("Authorization", `Bearer ${tokens.accessToken}`)
            .expect(400);
        expect(prisma.user.findFirst).not.toHaveBeenCalled();
    });

    it("scopes email lookup to the authenticated user", async () => {
        await request(app.getHttpServer())
            .get("/users?email=john@example.com")
            .set("Authorization", `bearer ${tokens.accessToken}`)
            .expect(200);
        expect(prisma.user.findFirst).toHaveBeenCalledWith({
            where: { email: user.email, id: user.id },
            select: { id: true, name: true, email: true }
        });
        prisma.user.findFirst.mockResolvedValue(null);
        await request(app.getHttpServer())
            .get("/users?email=other@example.com")
            .set("Authorization", `Bearer ${tokens.accessToken}`)
            .expect(400);
    });

    it.each(["/users", "/users?email=", "/users?email=a&email=b"])(
        "rejects missing or malformed email in %s",
        async path => {
            await request(app.getHttpServer())
                .get(path)
                .set("Authorization", `Bearer ${tokens.accessToken}`)
                .expect(400);
            expect(prisma.user.findFirst).not.toHaveBeenCalled();
        }
    );

    it("rejects refresh tokens on mutation routes", async () => {
        await request(app.getHttpServer())
            .put("/users/user-123")
            .set("Authorization", `Bearer ${tokens.refreshToken}`)
            .send({ name: "Changed" })
            .expect(401);
        await request(app.getHttpServer())
            .delete("/users/user-123")
            .set("Authorization", `Bearer ${tokens.refreshToken}`)
            .expect(401);
        expect(prisma.$transaction).not.toHaveBeenCalled();
    });
});
