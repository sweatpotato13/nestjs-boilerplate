import { Controller, Get, HttpCode, HttpStatus, Inject } from "@nestjs/common";
import { BaseResponseDto } from "@src/shared/dtos";

import { TemplateService } from "./template.service";

@Controller("template")
export class TemplateController {
    constructor(
        @Inject("TemplateService") private readonly service: TemplateService
    ) {}

    /**
     * Hello world example route
     * @returns {BaseResponseDto} Result of health check
     *
     * @tag template
     */
    @Get()
    @HttpCode(HttpStatus.OK)
    async healthCheck(): Promise<BaseResponseDto<undefined>> {
        const result = await this.service.healthCheck();
        return result;
    }
}
