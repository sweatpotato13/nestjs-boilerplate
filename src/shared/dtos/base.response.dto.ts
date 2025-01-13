import { IsOptional, IsString } from "class-validator";

/**
 * Generic Base Response DTO
 */
export class BaseResponseDto<T> {
    /**
     * Data object returned by the operation.
     */
    @IsOptional()
    readonly data?: T;

    /**
     * Message for additional context or error information.
     */
    @IsOptional()
    @IsString({ message: "message must be a string" })
    readonly message?: string;

    /**
     * Creates an instance of BaseResponseDto with given parameters.
     * @param params - Partial object containing properties to assign.
     * @returns A new instance of BaseResponseDto.
     */
    public static of<T>(
        params: Partial<BaseResponseDto<T>>
    ): BaseResponseDto<T> {
        const response = new BaseResponseDto<T>();
        Object.assign(response, params);
        return response;
    }
}
