import { IsString } from "class-validator";

export class UserDto {
    @IsString({ message: "Invalid provider" })
    readonly provider: string;

    @IsString({ message: "Invalid providerId" })
    readonly providerId: string;

    @IsString({ message: "Invalid email" })
    readonly email: string;

    @IsString({ message: "Invalid name" })
    readonly name: string;

    public static of(params: Partial<UserDto>): UserDto {
        const userDto = new UserDto();
        Object.assign(userDto, params);
        return userDto;
    }
}
