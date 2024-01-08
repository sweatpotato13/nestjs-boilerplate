import { IsNotEmpty, IsString } from "class-validator";

export class ProfileBodyDto {
    @IsString({ message: "Invalid name" })
    @IsNotEmpty()
    readonly name: string;

    public static of(params: Partial<ProfileBodyDto>): ProfileBodyDto {
        const dto = new ProfileBodyDto();
        Object.assign(dto, params);
        return dto;
    }
}
