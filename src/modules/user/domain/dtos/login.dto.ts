import { IsString } from "class-validator";

export class LoginDto {
    @IsString({ message: "Invalid account" })
    readonly account: string;

    public static of(params: Partial<LoginDto>): LoginDto {
        const loginDto = new LoginDto();
        Object.assign(loginDto, params);
        return loginDto;
    }
}
