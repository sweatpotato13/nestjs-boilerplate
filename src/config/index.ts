/* eslint-disable @typescript-eslint/no-empty-function */
import { config as _config } from "dotenv";
_config({ path: __dirname + "/../../.env" });
(process as any).send = process.send || function () {};

import ElasticsearchConfig from "./modules/elasticsearch/elasticsearch";
import JwtModuleConfig from "./modules/jwt";
import { loggerConfig } from "./modules/logger/logger";
import GoogleOauthConfig from "./modules/passport/google";
import RabbitMqConfig from "./modules/rabbitmq/rabbitmq";
import RedisModuleConfig from "./modules/redis";
import TypeOrmModuleConfig from "./modules/typeorm/typeorm";

export {
    ElasticsearchConfig,
    GoogleOauthConfig,
    JwtModuleConfig,
    loggerConfig,
    RabbitMqConfig,
    RedisModuleConfig,
    TypeOrmModuleConfig
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
    port: parseInt(process.env.PORT) || 8000,
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 10000,
    appSecret: process.env.APP_SECRET || "secret"
};
