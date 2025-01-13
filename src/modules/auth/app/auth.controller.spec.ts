import { ConfigType } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { GoogleOauthConfig } from "@src/config";
import { BaseResponseDto } from "@src/shared/dtos";
import httpMocks from "node-mocks-http";

import { TokensResponseDto } from "../domain/dtos";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

const mockAuthService: Partial<AuthService> = {
    googleLogin: jest.fn()
};

const mockGoogleConfig: ConfigType<typeof GoogleOauthConfig> = {
    clientId: "mock-client-id",
    clientSecret: "mock-client-secret",
    redirect: "mock-redirect"
};

describe("AuthController", () => {
    let authController: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: "AuthService", useValue: mockAuthService },
                {
                    provide: GoogleOauthConfig.KEY,
                    useValue: mockGoogleConfig
                }
            ],
            controllers: [AuthController]
        }).compile();

        authController = module.get<AuthController>(AuthController);
    });

    describe("GET /auth/login/google", () => {
        it("should return result when Google auth is enabled", () => {
            const resp = BaseResponseDto.of({
                message: "Google Authentication"
            });

            expect(authController.handleLogin()).toStrictEqual(resp);
        });
    });

    describe("GET /auth/login/google/callback", () => {
        it("should return tokens when Google auth is enabled", async () => {
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

            jest.spyOn(mockAuthService, "googleLogin").mockResolvedValue(resp);

            expect(await authController.handleRedirect(args)).toBe(resp);
        });
    });
});
