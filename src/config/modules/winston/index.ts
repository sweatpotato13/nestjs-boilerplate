import rTracer from "cls-rtracer";
import moment from "moment";
import {
    addColors,
    createLogger,
    format,
    Logger,
    LoggerOptions,
    transports
} from "winston";

const { splat, json, timestamp, align, printf } = format;

const config = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5,
        silly: 6,
        custom: 7
    },
    colors: {
        error: "red",
        debug: "blue",
        warn: "yellow",
        data: "grey",
        info: "green",
        verbose: "cyan",
        silly: "magenta",
        custom: "yellow"
    }
};

const logFormat = printf(info => {
    const rid = rTracer.id();
    return JSON.stringify({
        timestamp: info.timestamp,
        context: info.context,
        level: info.level,
        requestId: rid,
        userId: info.userId,
        query: info.query,
        variables: info.variables,
        code: info.code,
        path: info.path,
        stacktrace: info.stacktrace,
        message: info.message ? info.message : undefined
    });
});

const loggerOptions: LoggerOptions = {
    // level: "error",
    // levels: config.levels,
    format: format.combine(
        json(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        align(),
        splat(),
        // prettyPrint(),
        // colorize(),
        logFormat
    ),
    // defaultMeta: { service: "user-service" },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        // new transports.Console(),
        new transports.Console({
            level: "debug",
            handleExceptions: true
        }),
        new transports.File({
            filename: `logs/info/${moment().format("YYYY-MM-DD")}`,
            level: "info",
            handleExceptions: true,
            zippedArchive: true // TODO: 압축에 따른 CPU 오버헤드 고려해보기
        }),
        new transports.File({
            filename: `logs/error/${moment().format("YYYY-MM-DD")}`,
            level: "error",
            handleExceptions: true,
            zippedArchive: true // TODO: 압축에 따른 CPU 오버헤드 고려해보기
        }),
        new transports.File({
            filename: `logs/warn/${moment().format("YYYY-MM-DD")}`,
            level: "warn",
            handleExceptions: true,
            zippedArchive: true // TODO: 압축에 따른 CPU 오버헤드 고려해보기
        }),
        new transports.File({
            filename: `logs/debug/${moment().format("YYYY-MM-DD")}`,
            level: "debug",
            handleExceptions: true,
            zippedArchive: true // TODO: 압축에 따른 CPU 오버헤드 고려해보기
        }),
        new transports.File({
            filename: `logs/verbose/${moment().format("YYYY-MM-DD")}`,
            level: "verbose",
            handleExceptions: true,
            zippedArchive: true // TODO: 압축에 따른 CPU 오버헤드 고려해보기
        })
        // new transports.File({ filename: 'src/logs/combined.log' })
    ],
    exitOnError: false
};

addColors(config.colors);

function createAppLogger(): Logger {
    return createLogger(loggerOptions);
}

const logger: Logger = createAppLogger();

const errorStream = {
    write: (message: unknown): void => {
        createLogger(loggerOptions).error(message);
    }
};

export { errorStream, logger, loggerOptions };
