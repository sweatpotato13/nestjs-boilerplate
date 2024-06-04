import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

/**
 * Data transfer object for an app.
 */
@Exclude()
export class AppDto {
    /**
     * The name of the app.
     * @example "My App"
     */
    @Expose()
    @IsString({ message: "Invalid name" })
    readonly name: string;

    /**
     * The version of the app.
     * @example "1.0.0"
     */
    @Expose()
    @IsString({ message: "Invalid version" })
    readonly version: string;

    /**
     * Creates an instance of AppDto with the given parameters.
     * @param params - The partial parameters to initialize the AppDto.
     * @returns An instance of AppDto.
     */
    public static of(params: Partial<AppDto>): AppDto {
        const appDto = new AppDto();
        Object.assign(appDto, params);
        return appDto;
    }
}
