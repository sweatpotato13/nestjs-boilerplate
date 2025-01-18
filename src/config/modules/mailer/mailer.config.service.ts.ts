import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { MailerConfig } from "@src/config";

@Injectable()
export class MailerConfigService {
    constructor(
        @Inject(MailerConfig.KEY)
        private config: ConfigType<typeof MailerConfig>
    ) {}

    createMailerOptions(): any {
        return {
            transport: {
                host: this.config.host,
                port: this.config.port,
                secure: false, // true for 587, false for other ports
                auth: {
                    user: this.config.username,
                    pass: this.config.password
                }
            },
            defaults: {
                from: '"test" <test@test.com>'
            }
        };
    }
}
