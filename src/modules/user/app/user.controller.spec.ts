/* eslint-disable max-nested-callbacks */
import { Test, TestingModule } from "@nestjs/testing";
import { AccountDto, AuthMessageDto, LoginDto, RefreshTokenBodyDto, ResultDto, TokensResponseDto } from "../domain/dtos";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

const mockUserService: Partial<UserService> = {
    healthCheck: jest.fn(),
    getAuthMsg: jest.fn(),
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    deregister: jest.fn(),
};

describe("UserController", () => {
    let userController: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: "UserService", useValue: mockUserService },
            ],
            controllers: [UserController]
        }).compile();

        userController = module.get<UserController>(UserController);
    });

    describe("GET /", () => {
        it("should return healthCheck", async () => {
            const resp = "HealthCheck :)";

            jest
                .spyOn(mockUserService, "healthCheck")
                .mockImplementation(() => Promise.resolve(resp)
                );

            expect(await userController.healthCheck()).toBe(resp);
        });
    });

    describe("GET /user/auth", () => {
        it("should return auth message", async () => {
            const args = AccountDto.of({
                account: "account",
            })
            const resp = AuthMessageDto.of({
                authMessage: "random_auth_message",
            });

            jest
                .spyOn(mockUserService, "getAuthMsg")
                .mockImplementation(() => Promise.resolve(resp)
                );

            expect(await userController.getAuthMsg(args)).toBe(resp);
        });
    });

    describe("POST /user/register", () => {
        it("should return healthCheck", async () => {
            const args = LoginDto.of({
                account: "account",
                passwordHash: "d6dbf59ba21563bce0e219cf052f3925326a8be5da6da5ee8032b9b04280d5f0",
            })
            const resp = TokensResponseDto.of({
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                refreshToken: "JuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9",
            });

            jest
                .spyOn(mockUserService, "register")
                .mockImplementation(() => Promise.resolve(resp)
                );

            expect(await userController.register(args)).toBe(resp);
        });
    });

    describe("POST /user/login", () => {
        it("should return healthCheck", async () => {
            const args = LoginDto.of({
                account: "account",
                passwordHash: "d6dbf59ba21563bce0e219cf052f3925326a8be5da6da5ee8032b9b04280d5f0",
            })
            const resp = TokensResponseDto.of({
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                refreshToken: "JuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9",
            });

            jest
                .spyOn(mockUserService, "login")
                .mockImplementation(() => Promise.resolve(resp)
                );

            expect(await userController.login(args)).toBe(resp);
        });
    });

    describe("POST /user/refresh", () => {
        it("should return healthCheck", async () => {
            const args = RefreshTokenBodyDto.of({
                account: "account",
                refreshToken: "JuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9",
            })
            const resp = TokensResponseDto.of({
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                refreshToken: "JuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ0",
            });
            jest
                .spyOn(mockUserService, "refresh")
                .mockImplementation(() => Promise.resolve(resp)
                );

            expect(await userController.refresh(args)).toBe(resp);
        });
    });

    describe("DELETE /user/register", () => {
        it("should return healthCheck", async () => {
            const args = LoginDto.of({
                account: "account",
                passwordHash: "d6dbf59ba21563bce0e219cf052f3925326a8be5da6da5ee8032b9b04280d5f0",
            })
            const resp = ResultDto.of({
                result: "OK",
            });
            jest
                .spyOn(mockUserService, "deregister")
                .mockImplementation(() => Promise.resolve(resp)
                );

            expect(await userController.deregister(args)).toBe(resp);
        });
    });
});