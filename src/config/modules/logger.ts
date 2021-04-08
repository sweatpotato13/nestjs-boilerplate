import { config } from "@config";
import { registerAs } from "@nestjs/config";
import { format, LoggerOptions, transports } from "winston";
import { MongoDB } from "winston-mongodb";

const { splat, json, timestamp, align, printf } = format;

const dbUrl = `mongodb://${config.mongodbUser}:${config.mongodbPassword}@${config.mongodbHost}:${config.mongodbPort}/admin`;

const consoleFormat = printf(info => {
    return JSON.stringify({
        timestamp: info.timestamp,
        level: info.level,
        message: info.message ? info.message : undefined,
        meta: info.meta,
    });
});

export default registerAs(
    "logger",
    (): LoggerOptions => ({
        format: format.combine(
            json(),
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            align(),
            splat(),
            consoleFormat
        ),
        transports: [
            new transports.Console({
                level: "debug",
                handleExceptions: true,
            }),
            new MongoDB({
                db: dbUrl,
                collection:
                    process.env.MONGODB_LOG_INFO_COLLECTION_NAME ||
                    "sample-log-info",
                level: "info",
                capped: true,
                options: {
                    useUnifiedTopology: true,
                },
                metaKey: "meta",
            }),
            new MongoDB({
                db: dbUrl,
                collection:
                    process.env.MONGODB_LOG_ERROR_COLLECTION_NAME ||
                    "sample-log-error",
                level: "error",
                capped: true,
                options: {
                    useUnifiedTopology: true,
                },
                metaKey: "meta",
            }),
        ],
        exitOnError: false,
    })
);
