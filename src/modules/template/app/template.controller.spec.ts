import { Test, TestingModule } from "@nestjs/testing";
import { BaseResponseDto } from "@src/shared/dtos";
import { JwtService } from "@src/shared/modules/jwt/jwt.service";
import { PrismaService } from "@src/shared/services";

import { TemplateController } from "./template.controller";
import { TemplateService } from "./template.service";

const mockTemplateService: Partial<TemplateService> = {
    healthCheck: jest.fn()
};

const mockJwtService: Partial<JwtService> = {
    createUserJwt: jest.fn(),
    signJwt: jest.fn(),
    decodeJwt: jest.fn()
};

const mockPrismaService: Partial<PrismaService> = {};

describe("TemplateController", () => {
    let templateController: TemplateController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: "TemplateService", useValue: mockTemplateService },
                { provide: "JwtService", useValue: mockJwtService },
                { provide: "PrismaService", useValue: mockPrismaService }
            ],
            controllers: [TemplateController]
        }).compile();

        templateController = module.get<TemplateController>(TemplateController);
    });

    describe("GET /", () => {
        it("should return health check", async () => {
            const mockResponse = BaseResponseDto.of<undefined>({
                message: "Hello World"
            });

            jest.spyOn(mockTemplateService, "healthCheck").mockResolvedValue(
                mockResponse
            );

            const result = await templateController.healthCheck();
            expect(result).toBe(mockResponse);
            expect(mockTemplateService.healthCheck).toHaveBeenCalled();
        });
    });
});
