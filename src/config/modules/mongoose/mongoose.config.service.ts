import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import {
    MongooseModuleOptions,
    MongooseOptionsFactory
} from "@nestjs/mongoose";
import { MongooseConfig } from "@src/config";

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
    constructor(
        @Inject(MongooseConfig.KEY)
        private config: ConfigType<typeof MongooseConfig>
    ) {}

    createMongooseOptions(): MongooseModuleOptions {
        return {
            uri: `mongodb://${this.config.user}:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.db}`
        };
    }
}
