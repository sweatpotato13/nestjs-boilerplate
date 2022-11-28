import { IsString } from "class-validator";

export class AuthMessageDto {
    @IsString()
    readonly authMsg: string;

    public static of(params: Partial<AuthMessageDto>): AuthMessageDto {
        const authMessageDto = new AuthMessageDto();
        Object.assign(authMessageDto, params);
        return authMessageDto;
    }
}
