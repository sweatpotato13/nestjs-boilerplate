import { registerAs } from "@nestjs/config";

export default registerAs("mailer", () => ({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.MAIL_PORT || "582"),
    username: process.env.MAIL_USERNAME || "example@gmail.com",
    password: process.env.MAIL_PASSWORD || "password"
}));
