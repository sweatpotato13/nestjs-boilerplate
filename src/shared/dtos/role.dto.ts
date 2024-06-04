import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

/**
 * Data transfer object for Role.
 */
@Exclude()
export class RoleDto {
    /**
     * The name of the role.
     * @example "admin"
     */
    @Expose()
    @IsString({ message: "Invalid name" })
    readonly name: string;

    /**
     * The description of the role.
     * @example "Administrator role"
     */
    @Expose()
    @IsString({ message: "Invalid description" })
    @IsOptional()
    readonly description?: string;

    /**
     * Creates a new RoleDto instance with the given parameters.
     * @param params - Partial parameters to initialize the RoleDto object.
     * @returns A new RoleDto instance.
     */
    public static of(params: Partial<RoleDto>): RoleDto {
        const roleDto = new RoleDto();
        Object.assign(roleDto, params);
        return roleDto;
    }
}
