import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { logger, errorStream } from "@common/winston";
import { AppModule } from "./app.module";
import { json } from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import rTracer from "cls-rtracer";
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository
} from "typeorm-transactional-cls-hooked";
import { config } from "@config";
import { BadRequestExceptionFilter } from "./common/filters/bad-request-exception.filter";

initializeTransactionalContext();
patchTypeORMRepositoryWithBaseRepository();

async function bootstrap() {
    try {
        const app = await NestFactory.create<NestExpressApplication>(
            AppModule,
            {
                // httpsOptions: {
                //     key: fs.readFileSync(`./ssl/product/server.key`),
                //     cert: fs.readFileSync(`./ssl/product/server.crt`)
                // },
                // logger: WinstonModule.createLogger(loggerOptions)
            }
        );
        app.useGlobalPipes(new ValidationPipe());
        app.useGlobalFilters(new BadRequestExceptionFilter());
        app.use(helmet());

        app.use(rTracer.expressMiddleware());

        app.use(json({ limit: "50mb" }));

        // rateLimit
        app.use(
            rateLimit({
                windowMs: 1000 * 60 * 60, // an hour
                max: config.rateLimitMax, // limit each IP to 100 requests per windowMs
                message:
                    "⚠️  Too many request created from this IP, please try again after an hour"
            })
        );

        app.use(
            morgan("tiny", {
                skip(req, res) {
                    return res.statusCode < 400;
                },
                stream: errorStream
            })
        );

        app.use("*", (req, res, next) => {
            const query = req.query.query || req.body.query || "";
            if (query.length > 2000) {
                throw new Error("Query too large");
            }
            next();
        });

        await app.listen(config.port, () => {
            !config.isProduction
                ? logger.info(
                      `🚀  Server ready at http://${config.host}:${config.port}`,
                      { context: "BootStrap" }
                  )
                : logger.info(
                      `🚀  Server is listening on port ${config.port}`,
                      { context: "BootStrap" }
                  );

            !config.isProduction &&
                logger.info(
                    `🚀  Subscriptions ready at ws://${config.host}:${config.port}`,
                    { context: "BootStrap" }
                );
        });
    } catch (error) {
        logger.error(`❌  Error starting server, ${error}`, {
            context: "BootStrap"
        });
        process.exit();
    }
}

bootstrap();
