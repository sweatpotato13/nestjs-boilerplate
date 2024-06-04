import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

/**
 * Data Transfer Object for User.
 * This class represents the structure of user data that is sent between the client and the server.
 */
@Exclude()
export class UserDto {
    /**
     * The user's account.
     * @example "john.doe"
     */
    @Expose()
    @IsString({ message: "Invalid account" })
    readonly account: string;

    /**
     * Creates a new instance of UserDto with the provided parameters.
     * @param params - Partial<UserDto> object containing the properties to be assigned to the new UserDto instance.
     * @returns A new instance of UserDto.
     */
    public static of(params: Partial<UserDto>): UserDto {
        const userDto = new UserDto();
        Object.assign(userDto, params);
        return userDto;
    }
}
