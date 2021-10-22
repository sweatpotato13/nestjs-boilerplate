import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";


@Exclude()
export class HubDto {
    @Expose()
    @IsString({ message: "Invalid hub id" })
    readonly hub: string;

    @Expose()
    @IsString({ message: "Invalid profile id" })
    readonly profile: string;


    public static of(params: Partial<HubDto>): HubDto {
        const hubDto = new HubDto();
        Object.assign(hubDto, params);
        return hubDto;
    }
}
