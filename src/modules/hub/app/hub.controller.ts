import { Body, Controller, Inject, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { ErrorResponse, SuccessResponse } from "@src/shared/models/responses";
import { DiscardHubDto } from "../domain/dtos/discard-hub.dto";
import { RegisterHubDto } from "../domain/dtos/register-hub.dto";
import { IHubService } from "../domain/interfaces/hub.interface";
import { ErrorCodes } from "@src/shared/constants";

@Controller()
export class HubController {
    constructor(@Inject("HubService") private readonly _service: IHubService) {}

    @Post("register")
    async registerHub(
        @Body() registerHubDto: RegisterHubDto,
        @Res() res: Response
    ): Promise<any> {
        try {
            const hubDid = await this._service.registerHub(registerHubDto);
            res.status(200).send(
                new SuccessResponse("Registered new Profile", {
                    hub: hubDid
                })
            );
        } catch (err) {
            res.status(400).send(
                new ErrorResponse(
                    "There was an error registering for Hub",
                    ErrorCodes.HUB_REG_ERR,
                    err
                )
            );
        }
    }

    @Post("discard")
    async discardHub(
        @Body() discardHubDto: DiscardHubDto,
        @Res() res: Response
    ): Promise<any> {
        try {
            const hubDid = await this._service.discardHub(discardHubDto);
            res.status(200).send(
                new SuccessResponse("Deleted profile and hub instance", {
                    hub: hubDid
                })
            );
        } catch (err) {
            res.status(400).send(
                new ErrorResponse(
                    "There was an error deleting Hub instance",
                    ErrorCodes.HUB_DEL_ERR,
                    err
                )
            );
        }
    }
}
