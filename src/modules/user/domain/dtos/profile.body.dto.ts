import { IsNotEmpty, IsString } from "class-validator";

/**
 * Represents the data transfer object for the profile body.
 */
export class ProfileBodyDto {
    /**
     * The name of the profile.
     * @remarks This field is required and must be a string.
     */
    @IsString({ message: "name must be a string" })
    @IsNotEmpty()
    readonly name!: string;

    /**
     * Creates an instance of ProfileBodyDto.
     * @param params - The partial parameters to initialize the object.
     * @returns A new instance of ProfileBodyDto.
     */
    public static of(params: Partial<ProfileBodyDto>): ProfileBodyDto {
        const dto = new ProfileBodyDto();
        Object.assign(dto, params);
        return dto;
    }
}
