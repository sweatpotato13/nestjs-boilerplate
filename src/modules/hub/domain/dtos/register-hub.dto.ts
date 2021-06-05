import { IsString, IsNotEmpty } from "class-validator";

export class RegisterHubDto {
    @IsString()
    @IsNotEmpty()
    hubDid: string;

    @IsString()
    @IsNotEmpty()
    profile: string;

    @IsString()
    @IsNotEmpty()
    keyIndex: string;
}
