import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

@Exclude()
export class RoleDto {
    @Expose()
    @IsString({ message: "Invalid name" })
    readonly name: string;

    @Expose()
    @IsString({ message: "Invalid description" })
    @IsOptional()
    readonly description?: string;

    public static of(params: Partial<RoleDto>): RoleDto {
        const roleDto = new RoleDto();
        Object.assign(roleDto, params);
        return roleDto;
    }
}
