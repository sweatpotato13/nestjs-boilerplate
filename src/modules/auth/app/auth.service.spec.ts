import { CqrsModule } from "@nestjs/cqrs";
import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@src/shared/modules/jwt/jwt.service";
import { PrismaService } from "@src/shared/services";

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
        findFirst: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        findFirstOrThrow: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn()
    } as any,
    role: {
        findFirst: jest.fn(),
        create: jest.fn()
    } as any,
    userRole: {
        findFirst: jest.fn(),
        create: jest.fn()
    } as any,
    $transaction: jest.fn(callback => callback(mockPrismaService))
} as unknown as PrismaService;

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

            (mockPrismaService.user.findFirst as jest.Mock).mockResolvedValue(
                null
            );
            (mockPrismaService.user.create as jest.Mock).mockResolvedValue(
                mockUser
            );
            (mockPrismaService.role.findFirst as jest.Mock).mockResolvedValue(
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

            (mockPrismaService.user.findFirst as jest.Mock).mockResolvedValue(
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

            expect(result).toEqual(
                TokensResponseDto.of({
                    accessToken: "accessToken",
                    refreshToken: "refreshToken"
                })
            );
        });
    });
});
