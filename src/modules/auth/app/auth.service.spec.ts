import { CqrsModule } from "@nestjs/cqrs";
import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@src/shared/modules/jwt/jwt.service";

import { CommandHandlers } from "../domain/commands/handlers";
import { TokensResponseDto, UserDto } from "../domain/dtos";
import { QueryHandlers } from "../domain/queries/handlers";
import { AuthService } from "./auth.service";

const mockJwtService: Partial<JwtService> = {
    createUserJwt: jest.fn(),
    signJwt: jest.fn(),
    decodeJwt: jest.fn()
};

const mockPrismaService = {
    user: {
        findUnique: jest.fn(),
        upsert: jest.fn()
    },
    role: {
        upsert: jest.fn()
    },
    userRole: {
        createMany: jest.fn()
    },
    $transaction: jest.fn(callback => callback(mockPrismaService))
};

describe("AuthService", () => {
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CqrsModule],
            providers: [
                AuthService,
                { provide: "JwtService", useValue: mockJwtService },
                { provide: "PrismaService", useValue: mockPrismaService },
                ...CommandHandlers,
                ...QueryHandlers
            ]
        }).compile();
        await module.init();
        authService = module.get<AuthService>(AuthService);
    });

    describe("googleLogin", () => {
        it("should return access token for new user", async () => {
            const args = UserDto.of({
                email: "test@test.com",
                name: "test",
                provider: "google",
                providerId: "id"
            });

            const mockUser = {
                id: "user-123",
                email: "test@test.com",
                name: "test",
                provider: "google",
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const mockRole = {
                id: 1,
                name: "user",
                description: null
            };

            (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(
                null
            );
            (mockPrismaService.user.upsert as jest.Mock).mockResolvedValue(
                mockUser
            );
            (mockPrismaService.role.upsert as jest.Mock).mockResolvedValue(
                mockRole
            );
            (mockPrismaService.$transaction as jest.Mock).mockImplementation(
                callback => callback(mockPrismaService)
            );

            (mockJwtService.createUserJwt as jest.Mock).mockReturnValue({
                accessToken: "accessToken",
                refreshToken: "refreshToken"
            });

            const result = await authService.googleLogin(args);

            expect(result).toEqual(
                TokensResponseDto.of({
                    accessToken: "accessToken",
                    refreshToken: "refreshToken"
                })
            );
        });

        it("should return access token for existing user", async () => {
            const args = UserDto.of({
                email: "test@test.com",
                name: "test",
                provider: "google",
                providerId: "id"
            });

            const mockUser = {
                id: "user-123",
                email: "test@test.com",
                name: "test",
                provider: "google",
                createdAt: new Date(),
                updatedAt: new Date()
            };

            (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(
                mockUser
            );
            (mockPrismaService.$transaction as jest.Mock).mockImplementation(
                callback => callback(mockPrismaService)
            );

            (mockJwtService.createUserJwt as jest.Mock).mockReturnValue({
                accessToken: "accessToken",
                refreshToken: "refreshToken"
            });

            const result = await authService.googleLogin(args);

            expect(mockPrismaService.user.upsert).not.toHaveBeenCalled();
            expect(mockPrismaService.role.upsert).not.toHaveBeenCalled();
            expect(
                mockPrismaService.userRole.createMany
            ).not.toHaveBeenCalled();
            expect(result).toEqual(
                TokensResponseDto.of({
                    accessToken: "accessToken",
                    refreshToken: "refreshToken"
                })
            );
        });
    });
});
