import { Body, Controller, Inject, Post, Res } from "@nestjs/common";
import { ErrorResponse, SuccessResponse } from "@src/shared/models/responses";
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
            return new SuccessResponse("Registered new Profile", {
                hub: hubDid
            })

        } catch (err) {
            return new ErrorResponse(
                "There was an error registering for Hub",
                ErrorCodes.HUB_REG_ERR,
                err
            )
        }
    }

    @Post("discard")
    async discardHub(
        @Body() discardHubDto: DiscardHubDto,
    ): Promise<any> {
        try {
            const hubDid = await this._service.discardHub(discardHubDto);
            return new SuccessResponse("Deleted profile and hub instance", {
                hub: hubDid
            })
        } catch (err) {
            return new ErrorResponse(
                "There was an error deleting Hub instance",
                ErrorCodes.HUB_DEL_ERR,
                err
            )
        }
    }
}
