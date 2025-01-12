import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule as NestMongooseModule } from "@nestjs/mongoose";
import { MongooseConfig } from "@src/config";
import { MongooseConfigService } from "@src/config/modules/mongoose/mongoose.config.service";

import { MongooseService } from "./mongoose.service";

@Module({
    imports: [
        ConfigModule.forFeature(MongooseConfig),
        NestMongooseModule.forRootAsync({
            useClass: MongooseConfigService
        })
    ],
    providers: [{ provide: "MongooseService", useClass: MongooseService }],
    controllers: []
})
export class MongooseModule {}
