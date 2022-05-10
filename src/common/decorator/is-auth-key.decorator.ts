import { registerDecorator, ValidationOptions } from "class-validator";

export function IsAuthKey(validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            name: "isAuthKey",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: string): boolean {
                    if (value && value.split("_")[0] === "imp") return true;
                    return false;
                },
            },
        });
    };
}
