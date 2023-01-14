import { IsString } from "class-validator";

export class AuthMessageDto {
    @IsString()
    readonly authMessage: string;

    public static of(params: Partial<AuthMessageDto>): AuthMessageDto {
        const authMessageDto = new AuthMessageDto();
        Object.assign(authMessageDto, params);
        return authMessageDto;
    }
}
