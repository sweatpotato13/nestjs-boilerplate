/* eslint-disable max-nested-callbacks */
import { CommandBus, CqrsModule, QueryBus } from "@nestjs/cqrs";
import { Test, TestingModule } from "@nestjs/testing";

import {
    DeleteUserCommand,
    UpdateUserProfileCommand
} from "../domain/commands/impl";
import { ProfileBodyDto } from "../domain/dtos";
import {
    GetUserByEmailQuery,
    GetUserByIdQuery,
    HealthCheckQuery,
    MqHealthCheckQuery
} from "../domain/queries/impl";
import { UserService } from "./user.service";

const mockQueryBus = {
    execute: jest.fn()
};

const mockCommandBus = {
    execute: jest.fn()
};

jest.mock("typeorm-transactional", () => ({
    Transactional: () => () => ({}),
    BaseRepository: class {},
    runOnTransactionCommit: jest.fn(),
    runOnTransactionRollback: jest.fn(),
    runOnTransactionComplete: jest.fn()
}));

describe("UserService", () => {
    let userService: UserService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let queryBus: QueryBus;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let commandBus: CommandBus;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CqrsModule],
            providers: [
                UserService,
                { provide: QueryBus, useValue: mockQueryBus },
                { provide: CommandBus, useValue: mockCommandBus }
            ]
        }).compile();
        await module.init();
        userService = module.get<UserService>(UserService);
        commandBus = module.get<CommandBus>(CommandBus);
        queryBus = module.get<QueryBus>(QueryBus);
    });

    describe("healthCheck", () => {
        it("should return the result of HealthCheckQuery", async () => {
            // Arrange
            const expectedResult = "mocked result";
            jest.spyOn(mockQueryBus, "execute").mockResolvedValue(
                expectedResult
            );

            // Act
            const result = await userService.healthCheck();

            // Assert
            expect(result).toBe(expectedResult);
            expect(mockQueryBus.execute).toHaveBeenCalledWith(
                new HealthCheckQuery()
            );
        });

        it("should throw an error if HealthCheckQuery fails", async () => {
            // Arrange
            const expectedError = new Error("mocked error");
            jest.spyOn(mockQueryBus, "execute").mockRejectedValue(
                expectedError
            );

            // Act & Assert
            await expect(userService.healthCheck()).rejects.toThrow(
                expectedError
            );
            expect(mockQueryBus.execute).toHaveBeenCalledWith(
                new HealthCheckQuery()
            );
        });
    });

    describe("getUserById", () => {
        it("should return the result of GetUserByIdQuery", async () => {
            // Arrange
            const id = "mocked id";
            const expectedResult = "mocked result";
            jest.spyOn(mockQueryBus, "execute").mockResolvedValue(
                expectedResult
            );

            // Act
            const result = await userService.getUserById(id);

            // Assert
            expect(result).toBe(expectedResult);
            expect(mockQueryBus.execute).toHaveBeenCalledWith(
                new GetUserByIdQuery(id)
            );
        });

        it("should throw an error if GetUserByIdQuery fails", async () => {
            // Arrange
            const id = "mocked id";
            const expectedError = new Error("mocked error");
            jest.spyOn(mockQueryBus, "execute").mockRejectedValue(
                expectedError
            );

            // Act & Assert
            await expect(userService.getUserById(id)).rejects.toThrow(
                expectedError
            );
            expect(mockQueryBus.execute).toHaveBeenCalledWith(
                new GetUserByIdQuery(id)
            );
        });
    });

    describe("getUserByEmail", () => {
        it("should return the result of GetUserByEmailQuery", async () => {
            // Arrange
            const email = "mocked email";
            const expectedResult = "mocked result";
            jest.spyOn(mockQueryBus, "execute").mockResolvedValue(
                expectedResult
            );

            // Act
            const result = await userService.getUserByEmail(email);

            // Assert
            expect(result).toBe(expectedResult);
            expect(mockQueryBus.execute).toHaveBeenCalledWith(
                new GetUserByEmailQuery(email)
            );
        });

        it("should throw an error if GetUserByEmailQuery fails", async () => {
            // Arrange
            const email = "mocked email";
            const expectedError = new Error("mocked error");
            jest.spyOn(mockQueryBus, "execute").mockRejectedValue(
                expectedError
            );

            // Act & Assert
            await expect(userService.getUserByEmail(email)).rejects.toThrow(
                expectedError
            );
            expect(mockQueryBus.execute).toHaveBeenCalledWith(
                new GetUserByEmailQuery(email)
            );
        });
    });

    describe("updateUserProfile", () => {
        it("should return the result of UpdateUserProfileCommand", async () => {
            // Arrange
            const id = "mocked id";
            const userId = "mocked userId";
            const profile = ProfileBodyDto.of({}); // mocked profile object
            const expectedResult = "mocked result";
            jest.spyOn(mockCommandBus, "execute").mockResolvedValue(
                expectedResult
            );

            // Act
            const result = await userService.updateUserProfile(
                id,
                userId,
                profile
            );

            // Assert
            expect(result).toBe(expectedResult);
            expect(mockCommandBus.execute).toHaveBeenCalledWith(
                new UpdateUserProfileCommand(id, userId, profile)
            );
        });

        it("should throw an error if UpdateUserProfileCommand fails", async () => {
            // Arrange
            const id = "mocked id";
            const userId = "mocked userId";
            const profile = ProfileBodyDto.of({}); // mocked profile object
            const expectedError = new Error("mocked error");
            jest.spyOn(mockCommandBus, "execute").mockRejectedValue(
                expectedError
            );

            // Act & Assert
            await expect(
                userService.updateUserProfile(id, userId, profile)
            ).rejects.toThrow(expectedError);
            expect(mockCommandBus.execute).toHaveBeenCalledWith(
                new UpdateUserProfileCommand(id, userId, profile)
            );
        });
    });

    describe("deleteUser", () => {
        it("should return the result of DeleteUserCommand", async () => {
            // Arrange
            const id = "mocked id";
            const userId = "mocked userId";
            const expectedResult = "mocked result";
            jest.spyOn(mockCommandBus, "execute").mockResolvedValue(
                expectedResult
            );

            // Act
            const result = await userService.deleteUser(id, userId);

            // Assert
            expect(result).toBe(expectedResult);
            expect(mockCommandBus.execute).toHaveBeenCalledWith(
                new DeleteUserCommand(id, userId)
            );
        });

        it("should throw an error if DeleteUserCommand fails", async () => {
            // Arrange
            const id = "mocked id";
            const userId = "mocked userId";
            const expectedError = new Error("mocked error");
            jest.spyOn(mockCommandBus, "execute").mockRejectedValue(
                expectedError
            );

            // Act & Assert
            await expect(userService.deleteUser(id, userId)).rejects.toThrow(
                expectedError
            );
            expect(mockCommandBus.execute).toHaveBeenCalledWith(
                new DeleteUserCommand(id, userId)
            );
        });
    });

    describe("mqHealthCheck", () => {
        it("should return the result of MqHealthCheckQuery", async () => {
            // Arrange
            const expectedResult = "mocked result";
            jest.spyOn(mockQueryBus, "execute").mockResolvedValue(
                expectedResult
            );

            // Act
            const result = await userService.mqHealthCheck();

            // Assert
            expect(result).toBe(expectedResult);
            expect(mockQueryBus.execute).toHaveBeenCalledWith(
                new MqHealthCheckQuery()
            );
        });

        it("should throw an error if MqHealthCheckQuery fails", async () => {
            // Arrange
            const expectedError = new Error("mocked error");
            jest.spyOn(mockQueryBus, "execute").mockRejectedValue(
                expectedError
            );

            // Act & Assert
            await expect(userService.mqHealthCheck()).rejects.toThrow(
                expectedError
            );
            expect(mockQueryBus.execute).toHaveBeenCalledWith(
                new MqHealthCheckQuery()
            );
        });
    });
});
