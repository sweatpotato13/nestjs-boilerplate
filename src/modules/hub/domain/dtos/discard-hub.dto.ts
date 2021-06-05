import { IsString, IsNotEmpty } from "class-validator";

export class DiscardHubDto {
    @IsString()
    @IsNotEmpty()
    hub: string;

    @IsString()
    @IsNotEmpty()
    iss: string;
}
