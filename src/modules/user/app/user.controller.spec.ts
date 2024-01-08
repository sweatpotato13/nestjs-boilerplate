/* eslint-disable max-nested-callbacks */
import { Test, TestingModule } from "@nestjs/testing";
import { Role, User, UserRole } from "@src/shared/entities";
import { JwtService } from "@src/shared/modules/jwt/jwt.service";
import { Repository } from "typeorm";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

const mockUserService: Partial<UserService> = {
    healthCheck: jest.fn(),
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
    updateUserProfile: jest.fn(),
    deleteUser: jest.fn(),
    mqHealthCheck: jest.fn()
};

const mockUserRepository: Partial<Repository<User>> = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn()
};
const mockUserRoleRepository: Partial<Repository<UserRole>> = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn()
};
const mockRoleRepository: Partial<Repository<Role>> = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn()
};
const mockJwtService: Partial<JwtService> = {
    createUserJwt: jest.fn(),
    signJwt: jest.fn(),
    decodeJwt: jest.fn()
};

jest.mock("typeorm-transactional", () => ({
    Transactional: () => () => ({}),
    BaseRepository: class {},
    runOnTransactionCommit: jest.fn(),
    runOnTransactionRollback: jest.fn(),
    runOnTransactionComplete: jest.fn()
}));

describe("UserController", () => {
    let userController: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: "UserService", useValue: mockUserService },
                { provide: "JwtService", useValue: mockJwtService },
                { provide: "UserRepository", useValue: mockUserRepository },
                {
                    provide: "UserRoleRepository",
                    useValue: mockUserRoleRepository
                },
                { provide: "RoleRepository", useValue: mockRoleRepository }
            ],
            controllers: [UserController]
        }).compile();

        userController = module.get<UserController>(UserController);
    });

    describe("GET /", () => {
        it("should return healthCheck", async () => {
            const resp = "HealthCheck :)";

            jest.spyOn(mockUserService, "healthCheck").mockImplementation(() =>
                Promise.resolve(resp)
            );

            expect(await userController.healthCheck()).toBe(resp);
        });
    });

    describe("GET /:id", () => {
        it("should return user by id", async () => {
            const id = "123";
            const user = { id, name: "John Doe" };

            jest.spyOn(mockUserService, "getUserById").mockImplementation(() =>
                Promise.resolve(user)
            );

            expect(await userController.getUserById(id)).toBe(user);
        });
    });

    describe("GET /:email", () => {
        it("should return user by email", async () => {
            const email = "john@example.com";
            const user = { id: "123", email };

            jest.spyOn(mockUserService, "getUserByEmail").mockImplementation(
                () => Promise.resolve(user)
            );

            expect(await userController.getUserByEmail(email)).toBe(user);
        });
    });

    describe("PUT /:id/profile", () => {
        it("should update user profile", async () => {
            const id = "123";
            const userId = "456";
            const profile = { name: "John Doe", age: 30 };

            jest.spyOn(mockUserService, "updateUserProfile").mockImplementation(
                () => Promise.resolve(profile)
            );

            expect(
                await userController.updateUserProfile(id, userId, profile)
            ).toBe(profile);
        });
    });

    describe("DELETE /:id", () => {
        it("should delete user", async () => {
            const id = "123";
            const userId = "456";

            jest.spyOn(mockUserService, "deleteUser").mockImplementation(() =>
                Promise.resolve()
            );

            expect(await userController.deleteUser(id, userId)).toBeUndefined();
        });
    });

    describe("GET /mq", () => {
        it("should return mqHealthCheck", async () => {
            const resp = "MQ HealthCheck :)";

            jest.spyOn(mockUserService, "mqHealthCheck").mockImplementation(
                () => Promise.resolve(resp)
            );

            expect(await userController.mqHealthCheck()).toBe(resp);
        });
    });
});
