import { Body, Controller, Inject, Post, Res } from "@nestjs/common";
import { DiscardHubDto } from "../domain/dtos/discard-hub.dto";
import { RegisterHubDto } from "../domain/dtos/register-hub.dto";
import { IHubService } from "../domain/interfaces/hub.interface";
import { ErrorCodes } from "@src/shared/constants";

@Controller()
export class HubController {
    constructor(@Inject("HubService") private readonly _service: IHubService) { }

    @Post("register")
    async registerHub(
        @Body() registerHubDto: RegisterHubDto,
    ): Promise<any> {
        try {
            const hubDid = await this._service.registerHub(registerHubDto);
            return hubDid;
        } catch (error) {
            throw error
        }
    }

    @Post("discard")
    async discardHub(
        @Body() discardHubDto: DiscardHubDto,
    ): Promise<any> {
        try {
            const hubDid = await this._service.discardHub(discardHubDto);
            return hubDid;
        } catch (error) {
            throw error
        }
    }
}
