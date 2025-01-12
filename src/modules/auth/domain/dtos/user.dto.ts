import { IsString } from "class-validator";

/**
 * Data Transfer Object (DTO) for User.
 */
export class UserDto {
    /**
     * The provider of the user.
     */
    @IsString({ message: "provider must be a string" })
    readonly provider!: string;

    /**
     * The provider ID of the user.
     */
    @IsString({ message: "providerId must be a string" })
    readonly providerId!: string;

    /**
     * The email of the user.
     */
    @IsString({ message: "email must be a string" })
    readonly email!: string;

    /**
     * The name of the user.
     */
    @IsString({ message: "name must be a string" })
    readonly name!: string;

    /**
     * Creates a new instance of UserDto with the provided parameters.
     * @param params - Partial<UserDto> object containing the parameters to assign.
     * @returns A new instance of UserDto.
     */
    public static of(params: Partial<UserDto>): UserDto {
        const userDto = new UserDto();
        Object.assign(userDto, params);
        return userDto;
    }
}
