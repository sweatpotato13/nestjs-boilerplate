import { IsNotEmpty, IsObject, IsString } from "class-validator";

/**
 * Represents the response DTO for getting a user.
 */
export class GetUserResponseDto {
    /**
     * The result of the operation.
     */
    @IsString({ message: "Invalid result" })
    readonly result!: string;

    /**
     * The user object.
     */
    @IsObject({ message: "Invalid user" })
    @IsNotEmpty()
    readonly user: any;

    /**
     * Creates an instance of GetUserResponseDto.
     * @param params - The partial parameters to initialize the DTO.
     * @returns A new instance of GetUserResponseDto.
     */
    public static of(params: Partial<GetUserResponseDto>): GetUserResponseDto {
        const dto = new GetUserResponseDto();
        Object.assign(dto, params);
        return dto;
    }
}
