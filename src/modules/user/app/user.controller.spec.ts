import { Test, TestingModule } from "@nestjs/testing";
import { BaseResponseDto } from "@src/shared/dtos";
import { JwtService } from "@src/shared/modules/jwt/jwt.service";
import { PrismaService } from "@src/shared/services";

import { GetUserResponseDto } from "../domain/dtos";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

const mockUserService: Partial<UserService> = {
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
    updateUserProfile: jest.fn(),
    deleteUser: jest.fn()
};

const mockJwtService: Partial<JwtService> = {
    createUserJwt: jest.fn(),
    signJwt: jest.fn(),
    decodeJwt: jest.fn()
};

const mockPrismaService: Partial<PrismaService> = {};

describe("UserController", () => {
    let userController: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: "UserService", useValue: mockUserService },
                { provide: "JwtService", useValue: mockJwtService },
                { provide: "PrismaService", useValue: mockPrismaService }
            ],
            controllers: [UserController]
        }).compile();

        userController = module.get<UserController>(UserController);
    });

    describe("GET /users", () => {
        it("should return user by email", async () => {
            const email = "john@example.com";
            const mockResponse = GetUserResponseDto.of({
                user: {
                    id: "123",
                    email,
                    name: "John",
                    provider: "google"
                }
            });

            jest.spyOn(mockUserService, "getUserByEmail").mockResolvedValue(
                mockResponse
            );

            const result = await userController.getUserByEmail(email);
            expect(result).toBe(mockResponse);
            expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(email);
        });
    });

    describe("PUT /users/:id", () => {
        it("should update user profile", async () => {
            const id = "123";
            const userId = "123";
            const profile = { name: "John Doe" };
            const mockResponse = BaseResponseDto.of<undefined>({
                message: "OK"
            });

            jest.spyOn(mockUserService, "updateUserProfile").mockResolvedValue(
                mockResponse
            );

            const result = await userController.updateUserProfile(
                id,
                userId,
                profile
            );
            expect(result).toBe(mockResponse);
            expect(mockUserService.updateUserProfile).toHaveBeenCalledWith(
                id,
                userId,
                profile
            );
        });
    });

    describe("DELETE /users/:id", () => {
        it("should delete user", async () => {
            const id = "123";
            const userId = "123";
            const mockResponse = BaseResponseDto.of<undefined>({
                message: "OK"
            });

            jest.spyOn(mockUserService, "deleteUser").mockResolvedValue(
                mockResponse
            );

            const result = await userController.deleteUser(id, userId);
            expect(result).toBe(mockResponse);
            expect(mockUserService.deleteUser).toHaveBeenCalledWith(id, userId);
        });
    });
});
