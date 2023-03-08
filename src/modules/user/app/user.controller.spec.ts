/* eslint-disable max-nested-callbacks */
import { Test, TestingModule } from "@nestjs/testing";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

const mockUserService: Partial<UserService> = {
    healthCheck: jest.fn()
};

describe("UserController", () => {
    let userController: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: "UserService", useValue: mockUserService }],
            controllers: [UserController]
        }).compile();

        userController = module.get<UserController>(UserController);
    });

    describe("GET /", () => {
        it("should return healthCheck", async () => {
            const resp = "HealthCheck :)";

            jest.spyOn(mockUserService, "healthCheck").mockImplementation(() =>
                Promise.resolve(resp)
            );

            expect(await userController.healthCheck()).toBe(resp);
        });
    });
});
