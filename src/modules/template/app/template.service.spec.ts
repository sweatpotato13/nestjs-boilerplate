import { CommandBus, CqrsModule, QueryBus } from "@nestjs/cqrs";
import { Test, TestingModule } from "@nestjs/testing";

import { HealthCheckQuery } from "../domain/queries/impl";
import { TemplateService } from "./template.service";

const mockQueryBus = {
    execute: jest.fn()
};

const mockCommandBus = {
    execute: jest.fn()
};

describe("TemplateService", () => {
    let templateService: TemplateService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let queryBus: QueryBus;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let commandBus: CommandBus;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CqrsModule],
            providers: [
                TemplateService,
                { provide: QueryBus, useValue: mockQueryBus },
                { provide: CommandBus, useValue: mockCommandBus }
            ]
        }).compile();
        await module.init();
        templateService = module.get<TemplateService>(TemplateService);
        commandBus = module.get<CommandBus>(CommandBus);
        queryBus = module.get<QueryBus>(QueryBus);
    });

    describe("healthCheck", () => {
        it("should return the result of health check", async () => {
            // Arrange
            const expectedResult = "mocked result";
            jest.spyOn(mockQueryBus, "execute").mockResolvedValue(
                expectedResult
            );

            // Act
            const result = await templateService.healthCheck();

            // Assert
            expect(result).toBe(expectedResult);
            expect(mockQueryBus.execute).toHaveBeenCalledWith(
                new HealthCheckQuery()
            );
        });

        it("should throw an error if health check fails", async () => {
            // Arrange
            const expectedError = new Error("mocked error");
            jest.spyOn(mockQueryBus, "execute").mockRejectedValue(
                expectedError
            );

            // Act & Assert
            await expect(templateService.healthCheck()).rejects.toThrow(
                expectedError
            );
            expect(mockQueryBus.execute).toHaveBeenCalledWith(
                new HealthCheckQuery()
            );
        });
    });
});
