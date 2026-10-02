import { IsNotEmpty, IsObject, IsString } from "class-validator";

/**
 * Represents the response DTO for getting a user.
 */
export class GetUserResponseDto {
    /**
     * The result of the operation.
     */
    @IsString({ message: "result must be a string" })
    readonly result!: string;

    /**
     * The user object.
     */
    @IsObject({ message: "user must be an object" })
    @IsNotEmpty()
    readonly user!: { id: string; name: string; email: string };

    /**
     * Creates an instance of GetUserResponseDto.
     * @param params - The partial parameters to initialize the DTO.
     * @returns A new instance of GetUserResponseDto.
     */
    public static of(params: {
        result?: string;
        user: GetUserResponseDto["user"];
    }): GetUserResponseDto {
        const dto = new GetUserResponseDto();
        const { id, name, email } = params.user;
        Object.assign(dto, {
            result: params.result ?? "OK",
            user: { id, name, email }
        });
        return dto;
    }
}
