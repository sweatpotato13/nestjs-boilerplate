import { IsString, IsNotEmpty } from "class-validator";

export class DiscardHubDto {
    @IsString()
    @IsNotEmpty()
    hub: string;

    @IsString()
    @IsNotEmpty()
    iss: string;

    public static of(params: Partial<DiscardHubDto>): DiscardHubDto {
        const discardHubDto = new DiscardHubDto();
        Object.assign(discardHubDto, params);
        return discardHubDto;
    }
}
