import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

@Exclude()
export class AppDto {
    @Expose()
    @IsString({ message: "Invalid name" })
    readonly name: string;

    @Expose()
    @IsString({ message: "Invalid version" })
    readonly version: string;

    public static of(params: Partial<AppDto>): AppDto {
        const appDto = new AppDto();
        Object.assign(appDto, params);
        return appDto;
    }
}
