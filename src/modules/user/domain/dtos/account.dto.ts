import { IsString } from "class-validator";

export class AccountDto {
    @IsString({ message: "Invalid account" })
    readonly account: string;

    public static of(params: Partial<AccountDto>): AccountDto {
        const accountDto = new AccountDto();
        Object.assign(accountDto, params);
        return accountDto;
    }
}
