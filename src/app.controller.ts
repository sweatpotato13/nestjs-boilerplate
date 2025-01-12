import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";

@Controller("")
export class AppController {
    constructor() {}

    /**
     * Health check endpoint.
     * @returns A Promise that resolves to the health check result.
     * @throws Throws an error if an error occurs during the health check.
     *
     */
    @Get()
    @HttpCode(HttpStatus.OK)
    healthCheck(): string {
        return "ok";
    }
}
