import { IsString } from "class-validator";

export class ResultResponseDto {
    @IsString({ message: "Invalid result" })
    readonly result: string;

    public static of(params: Partial<ResultResponseDto>): ResultResponseDto {
        const resultResponseDto = new ResultResponseDto();
        Object.assign(resultResponseDto, params);
        return resultResponseDto;
    }
}
