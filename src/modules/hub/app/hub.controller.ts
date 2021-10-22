import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { DiscardHubDto } from "../domain/dtos/discard-hub.dto";
import { RegisterHubDto } from "../domain/dtos/register-hub.dto";
import { IHubService } from "../domain/interfaces/hub.interface";

@Controller()
export class HubController {
    constructor(@Inject("HubService") private readonly _service: IHubService) {}

    @Get()
    async healthCheck(): Promise<any> {
        try {
            const result = await this._service.healthCheck();
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Post("register")
    async registerHub(@Body() registerHubDto: RegisterHubDto): Promise<any> {
        try {
            const result = await this._service.registerHub(registerHubDto);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Post("discard")
    async discardHub(@Body() discardHubDto: DiscardHubDto): Promise<any> {
        try {
            const result = await this._service.discardHub(discardHubDto);
            return result;
        } catch (error) {
            throw error;
        }
    }
}
