import { ConfigType } from "@nestjs/config";
import { Injectable, Inject } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { TypeOrmModuleConfig } from "@config";

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
