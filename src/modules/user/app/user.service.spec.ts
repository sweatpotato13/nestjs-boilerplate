/* eslint-disable max-nested-callbacks */
import { CqrsModule } from "@nestjs/cqrs";
import { Test, TestingModule } from "@nestjs/testing";

import { CommandHandlers } from "../domain/commands/handlers";
import { QueryHandlers } from "../domain/queries/handlers";
import { UserService } from "./user.service";

describe("UserService", () => {
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                CqrsModule,
            ],
            providers: [
                UserService,
                ...CommandHandlers,
                ...QueryHandlers
            ],
        }).compile();
        await module.init();
        userService = module.get<UserService>(UserService);
    });

    describe("healthCheck", () => {
        it("should return 'HealthCheck :)'", async () => {
            const resp = "HealthCheck :)";
            expect(await userService.healthCheck()).toBe(resp);
        });
    });
});