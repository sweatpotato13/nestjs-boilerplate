import { IsString } from "class-validator";

export class RefreshTokenBodyDto {
    @IsString({ message: "Invalid account" })
    readonly account: string;

    @IsString({ message: "Invalid refresh token" })
    readonly refreshToken: string;

    public static of(
        params: Partial<RefreshTokenBodyDto>
    ): RefreshTokenBodyDto {
        const refreshTokenBodyDto = new RefreshTokenBodyDto();
        Object.assign(refreshTokenBodyDto, params);
        return refreshTokenBodyDto;
    }
}
