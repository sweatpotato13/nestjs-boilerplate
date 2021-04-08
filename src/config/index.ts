import { config as _config } from "dotenv";
_config({ path: __dirname + "/../../.env" });
(process as any).send = process.send || function () {};

export const config = {
    // Base
    isProduction: process.env.NODE_ENV === "production",
    // General
    appName: process.env.APP_NAME || "boilerplate",
    appTitle: process.env.APP_TITLE || "boilerplate",
    appDescription: process.env.APP_DESCRIPTION || "boilerplate",
    // Server
    host: process.env.HOST || "0.0.0.0",
    port: parseInt(process.env.PORT) || 3000,
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 10000,
    // Logger
    mongodbUser: process.env.MONGODB_USER || "",
    mongodbPassword: process.env.MONGODB_PASSWORD || "",
    mongodbHost: process.env.MONGODB_HOST || "",
    mongodbPort: process.env.MONGODB_PORT || "",
};

import LoggerModuleConfig from "./modules/logger";

export { LoggerModuleConfig };
