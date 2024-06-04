import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

/**
 * Data transfer object for user role.
 * This class represents the structure of user role data.
 */
@Exclude()
export class UserRoleDto {
    /**
     * The ID of the user.
     */
    @Expose()
    @IsString({ message: "Invalid user id" })
    readonly userId: string;

    /**
     * The ID of the role.
     */
    @Expose()
    @IsString({ message: "Invalid role id" })
    readonly roleId: number;

    /**
     * Creates a new instance of UserRoleDto with the given parameters.
     * @param params - Partial data to initialize the UserRoleDto object.
     * @returns A new instance of UserRoleDto.
     */
    public static of(params: Partial<UserRoleDto>): UserRoleDto {
        const userRoleDto = new UserRoleDto();
        Object.assign(userRoleDto, params);
        return userRoleDto;
    }
}
