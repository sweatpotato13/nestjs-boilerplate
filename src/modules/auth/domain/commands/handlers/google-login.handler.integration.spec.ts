import { randomUUID } from "node:crypto";

import { JwtService } from "@shared/modules/jwt/jwt.service";
import { PrismaService } from "@shared/services";

import { UserDto } from "../../dtos";
import { GoogleLoginCommand } from "../impl/google-login.command";
import { GoogleLoginHandler } from "./google-login.handler";

const describeDatabase = process.env.TEST_DATABASE_URL
    ? describe
    : describe.skip;

describeDatabase("Google login with PostgreSQL", () => {
    const prisma = new PrismaService({
        datasourceUrl: process.env.TEST_DATABASE_URL
    });
    const prefix = randomUUID();
    const emails = [0, 1, 2].map(index => `${prefix}-${index}@example.com`);
    const createUserJwt = jest.fn((userId: string) => ({
        accessToken: userId,
        refreshToken: userId
    }));
    const handler = new GoogleLoginHandler(
        { createUserJwt } as unknown as JwtService,
        prisma
    );
    const command = (email: string) =>
        new GoogleLoginCommand(
            UserDto.of({ email, name: "Test user", provider: "google" })
        );

    afterAll(async () => {
        try {
            await prisma.user.deleteMany({ where: { email: { in: emails } } });
        } finally {
            await prisma.$disconnect();
        }
    });

    it("shares users and the default role across concurrent first logins", async () => {
        const results = await Promise.all(
            Array.from({ length: 12 }, (_, index) =>
                handler.execute(command(emails[index % 2]))
            )
        );
        const users = await prisma.user.findMany({
            where: { email: { in: emails } },
            include: { userRoles: { include: { role: true } } }
        });

        expect(users).toHaveLength(2);
        expect(await prisma.role.count({ where: { name: "user" } })).toBe(1);
        for (const [index, result] of results.entries()) {
            const user = users.find(user => user.email === emails[index % 2]);
            expect(result.accessToken).toBe(user?.id);
        }
        for (const user of users) {
            expect(user.userRoles).toHaveLength(1);
            expect(user.userRoles[0].role.name).toBe("user");
        }
    });

    it("rolls back a new account when token creation fails", async () => {
        createUserJwt.mockImplementationOnce(() => {
            throw new Error("Token signing failed");
        });

        await expect(handler.execute(command(emails[2]))).rejects.toThrow(
            "Token signing failed"
        );
        expect(
            await prisma.user.findUnique({ where: { email: emails[2] } })
        ).toBeNull();
    });
});
