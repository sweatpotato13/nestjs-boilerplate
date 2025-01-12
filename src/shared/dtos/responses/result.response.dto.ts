import { IsString } from "class-validator";

/**
 * Represents the response DTO for a result.
 */
export class ResultResponseDto {
    /**
     * The result value.
     */
    @IsString({ message: "result must be a string" })
    readonly result!: string;

    /**
     * Creates an instance of ResultResponseDto.
     * @param params - The partial parameters to initialize the DTO.
     * @returns A new instance of ResultResponseDto.
     */
    public static of(params: Partial<ResultResponseDto>): ResultResponseDto {
        const resultResponseDto = new ResultResponseDto();
        Object.assign(resultResponseDto, params);
        return resultResponseDto;
    }
}
