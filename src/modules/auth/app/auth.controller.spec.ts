/* eslint-disable max-nested-callbacks */
import { Test, TestingModule } from "@nestjs/testing";
import { ResultResponseDto } from "@src/shared/dtos";
import httpMocks from "node-mocks-http";

import { TokensResponseDto } from "../domain/dtos";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

const mockAuthService: Partial<AuthService> = {
    googleLogin: jest.fn()
};

describe("AuthController", () => {
    let authController: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: "AuthService", useValue: mockAuthService }],
            controllers: [AuthController]
        }).compile();

        authController = module.get<AuthController>(AuthController);
    });

    describe("GET /auth/google/login", () => {
        it("should return result", async () => {
            const resp = ResultResponseDto.of({
                result: "Google Authentication"
            });

            expect(await authController.handleLogin()).toStrictEqual(resp);
        });
    });

    describe("GET /auth/google/callback", () => {
        it("should return healthCheck", async () => {
            const args = httpMocks.createRequest({
                method: "GET",
                url: "/auth/google/callback",
                user: {
                    email: "test@test.com",
                    name: "test",
                    provider: "google",
                    providerId: "id"
                }
            });
            const resp = TokensResponseDto.of({
                accessToken: "accessToken",
                refreshToken: "refreshToken"
            });

            jest.spyOn(mockAuthService, "googleLogin").mockImplementation(() =>
                Promise.resolve(resp)
            );

            expect(await authController.handleRedirect(args)).toBe(resp);
        });
    });
});
