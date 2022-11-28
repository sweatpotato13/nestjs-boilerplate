import { TypeOrmModuleConfig } from "@config";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(
        @Inject(TypeOrmModuleConfig.KEY)
        private config: ConfigType<typeof TypeOrmModuleConfig>
    ) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return { ...this.config, autoLoadEntities: true };
    }
}
