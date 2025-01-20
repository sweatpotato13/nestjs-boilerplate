import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MailerModule as NestMailerModule } from "@nestjs-modules/mailer";
import { MailerConfig } from "@src/config";
import { MailerConfigService } from "@src/config/modules/mailer/mailer.config.service";

import { MailerService } from "./mailer.service";

@Module({
    imports: [
        ConfigModule.forFeature(MailerConfig),
        NestMailerModule.forRootAsync({
            imports: [ConfigModule.forFeature(MailerConfig)],
            useClass: MailerConfigService
        })
    ],
    providers: [
        {
            provide: "MailerService",
            useClass: MailerService
        }
    ],
    exports: ["MailerService"]
})
export class MailerModule {}
