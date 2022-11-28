import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

@Exclude()
export class UserDto {
    @Expose()
    @IsString({ message: "Invalid account" })
    readonly account: string;

    public static of(params: Partial<UserDto>): UserDto {
        const userDto = new UserDto();
        Object.assign(userDto, params);
        return userDto;
    }
}
