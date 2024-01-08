import { LoggerOptions, transports } from "winston";
import { MongoDB } from "winston-mongodb";

const dbURL = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`;

export const loggerConfig: LoggerOptions = {
    transports: [
        new transports.Console({
            level: "debug",
            handleExceptions: true
        }),
        ...(process.env.REMOTE_LOGGING_ENABLED === "true"
            ? [
                  new MongoDB({
                      db: dbURL,
                      collection: process.env.MONGODB_INFO_COLLECTION || "info",
                      level: "info",
                      capped: true,
                      options: {
                          useUnifiedTopology: true
                      },
                      metaKey: "meta",
                      decolorize: true
                  }),
                  new MongoDB({
                      db: dbURL,
                      collection:
                          process.env.MONGODB_ERROR_COLLECTION || "errors",
                      level: "error",
                      capped: true,
                      options: {
                          useUnifiedTopology: true
                      },
                      metaKey: "meta",
                      decolorize: true
                  })
              ]
            : [])
    ],
    exceptionHandlers: [
        new transports.File({
            filename: "log/exceptions.log"
        })
    ],
    exitOnError: false
};
