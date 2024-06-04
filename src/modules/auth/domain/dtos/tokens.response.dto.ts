import { IsString } from "class-validator";

/**
 * Represents the response DTO for tokens.
 */
export class TokensResponseDto {
    /**
     * The access token.
     */
    @IsString()
    readonly accessToken: string;

    /**
     * The refresh token.
     */
    @IsString()
    readonly refreshToken: string;

    /**
     * Creates an instance of TokensResponseDto.
     * @param params - The partial parameters to initialize the DTO.
     * @returns An instance of TokensResponseDto.
     */
    public static of(params: Partial<TokensResponseDto>): TokensResponseDto {
        const tokensResponseDto = new TokensResponseDto();
        Object.assign(tokensResponseDto, params);
        return tokensResponseDto;
    }
}
