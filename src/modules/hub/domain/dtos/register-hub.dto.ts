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

    public static of(params: Partial<RegisterHubDto>): RegisterHubDto {
        const registerHubDto = new RegisterHubDto();
        Object.assign(registerHubDto, params);
        return registerHubDto;
    }
}
