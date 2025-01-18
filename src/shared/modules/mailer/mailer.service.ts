import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";
import { MailerConfig } from "@src/config";

@Injectable()
export class MailService {
    constructor(
        @Inject(MailerConfig.KEY)
        private readonly config: ConfigType<typeof MailerConfig>,
        private readonly mailerService: MailerService
    ) {}

    public sendVerifyMail(to: string): void {
        const html = `<h1>Verify your email</h1>`;
        this.mailerService
            .sendMail({
                to, // list of receivers
                from: this.config.username, // sender address
                subject: "Verify your email", // Subject line
                html: html
            })
            .catch(err => {
                console.error(err);
            });
    }
}
