import { IsString } from "class-validator";

export class TokensResponseDto {
    @IsString()
    readonly accessToken: string;

    @IsString()
    readonly refreshToken: string;

    public static of(params: Partial<TokensResponseDto>): TokensResponseDto {
        const tokensResponseDto = new TokensResponseDto();
        Object.assign(tokensResponseDto, params);
        return tokensResponseDto;
    }
}
