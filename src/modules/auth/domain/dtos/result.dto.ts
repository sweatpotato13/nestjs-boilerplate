import { IsBoolean } from "class-validator";

export class ResultDto {
    @IsBoolean({ message: "Invalid result" })
    readonly result: string;

    public static of(params: Partial<ResultDto>): ResultDto {
        const resultDto = new ResultDto();
        Object.assign(resultDto, params);
        return resultDto;
    }
}
