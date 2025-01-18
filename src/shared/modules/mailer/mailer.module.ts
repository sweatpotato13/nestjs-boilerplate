import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { MailerConfig } from "@src/config";
import { MailerConfigService } from "@src/config/modules/mailer/mailer.config.service.ts";

import { MailService } from "./mailer.service";

@Module({
    imports: [
        ConfigModule.forFeature(MailerConfig),
        MailerModule.forRootAsync({
            imports: [ConfigModule.forFeature(MailerConfig)],
            useClass: MailerConfigService
        })
    ],
    providers: [
        {
            provide: "MailService",
            useClass: MailService
        }
    ],
    exports: ["MailService"]
})
export class MailModule {}
