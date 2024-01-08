/* eslint-disable max-nested-callbacks */
import { CqrsModule } from "@nestjs/cqrs";
import { Test, TestingModule } from "@nestjs/testing";
import { Role, User, UserRole } from "@src/shared/entities";
import { JwtService } from "@src/shared/modules/jwt/jwt.service";
import { Repository } from "typeorm";

import { CommandHandlers } from "../domain/commands/handlers";
import { TokensResponseDto, UserDto } from "../domain/dtos";
import { QueryHandlers } from "../domain/queries/handlers";
import { AuthService } from "./auth.service";

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

describe("AuthService", () => {
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CqrsModule],
            providers: [
                AuthService,
                { provide: "UserRepository", useValue: mockUserRepository },
                {
                    provide: "UserRoleRepository",
                    useValue: mockUserRoleRepository
                },
                { provide: "RoleRepository", useValue: mockRoleRepository },
                { provide: "JwtService", useValue: mockJwtService },
                ...CommandHandlers,
                ...QueryHandlers
            ]
        }).compile();
        await module.init();
        authService = module.get<AuthService>(AuthService);
    });

    describe("googleLogin", () => {
        it("should return access token", async () => {
            const args = UserDto.of({
                email: "test@test.com",
                name: "test",
                provider: "google",
                providerId: "id"
            });
            const resp = TokensResponseDto.of({
                accessToken: "accessToken",
                refreshToken: "refreshToken"
            });

            jest.spyOn(mockUserRepository, "findOne").mockImplementation(() =>
                Promise.resolve(
                    User.of({
                        email: "test@test.com",
                        name: "test",
                        provider: "google"
                    })
                )
            );

            jest.spyOn(mockJwtService, "createUserJwt").mockImplementation(() =>
                Promise.resolve({
                    accessToken: "accessToken",
                    refreshToken: "refreshToken"
                })
            );

            expect(await authService.googleLogin(args)).toStrictEqual(resp);
        });
    });
});
