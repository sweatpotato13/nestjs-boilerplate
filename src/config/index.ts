import { config as _config } from "dotenv";
_config({ path: __dirname + "/../../.env" });
if (typeof process.send !== "function") {
    (process as any).send = () => {};
}

import ElasticsearchConfig from "./modules/elasticsearch/elasticsearch";
import JwtModuleConfig from "./modules/jwt";
import KafkaConfg from "./modules/kafka/kafka";
import MailerConfig from "./modules/mailer/mailer";
import MongooseConfig from "./modules/mongoose/mongoose";
import GoogleOauthConfig from "./modules/passport/google";
import RedisModuleConfig from "./modules/redis";

export {
    ElasticsearchConfig,
    GoogleOauthConfig,
    JwtModuleConfig,
    KafkaConfg,
    MailerConfig,
    MongooseConfig,
    RedisModuleConfig
};

export const config = {
    // Base
    isProduction: process.env.NODE_ENV === "production",
    // General
    appName: process.env.APP_NAME || "boilerplate",
    appTitle: process.env.APP_TITLE || "boilerplate",
    appDescription: process.env.APP_DESCRIPTION || "boilerplate",
    // Server
    host: process.env.HOST || "0.0.0.0",
    port: parseInt(process.env.PORT || "8000"),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "10000"),
    appSecret: process.env.APP_SECRET || "secret"
};
