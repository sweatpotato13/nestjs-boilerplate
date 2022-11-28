import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

@Exclude()
export class UserRoleDto {
    @Expose()
    @IsString({ message: "Invalid user id" })
    readonly userId: string;

    @Expose()
    @IsString({ message: "Invalid role id" })
    readonly roleId: number;

    public static of(params: Partial<UserRoleDto>): UserRoleDto {
        const userRoleDto = new UserRoleDto();
        Object.assign(userRoleDto, params);
        return userRoleDto;
    }
}
