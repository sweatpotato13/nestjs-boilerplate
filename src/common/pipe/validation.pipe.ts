import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
    Type
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {
    async transform(value: unknown, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object as object);
        if (errors.length > 0) {
            throw new BadRequestException("Validation failed");
        }
        return value;
    }

    private toValidate(metatype: Type<any>): boolean {
        const types: Type<any>[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
