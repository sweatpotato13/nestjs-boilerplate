import { User } from "@src/shared/entities";
import { IsNotEmpty, IsObject, IsString } from "class-validator";

export class GetUserResponseDto {
    @IsString({ message: "Invalid result" })
    readonly result: string;

    @IsObject({ message: "Invalid user" })
    @IsNotEmpty()
    readonly user: User;

    public static of(params: Partial<GetUserResponseDto>): GetUserResponseDto {
        const dto = new GetUserResponseDto();
        Object.assign(dto, params);
        return dto;
    }
}
