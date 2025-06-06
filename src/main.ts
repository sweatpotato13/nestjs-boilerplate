/* eslint-disable @typescript-eslint/no-unused-expressions */
import { config } from "@config";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { json } from "body-parser";
import rTracer from "cls-rtracer";
import rateLimit from "express-rate-limit";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";

import { AppModule } from "./app.module";
import { BadRequestExceptionFilter } from "./common/filters/bad-request-exception.filter";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { TimeoutInterceptor } from "./common/interceptors/timeout.interceptor";
import { KafkaConfigService } from "./config/modules/kafka/kafka.config.service";
import { errorStream, logger } from "./config/modules/winston";

async function bootstrap() {
    try {
        const app = await NestFactory.create<NestExpressApplication>(
            AppModule,
            {}
        );
        app.useGlobalPipes(new ValidationPipe());
        app.useGlobalFilters(new BadRequestExceptionFilter());
        app.useGlobalInterceptors(new TimeoutInterceptor());
        app.useGlobalFilters(new HttpExceptionFilter());
        app.use(helmet());

        app.use(rTracer.expressMiddleware());

        app.use(json({ limit: "50mb" }));

        const configService = app.get(ConfigService);
        const kafkaConfig = configService.get("kafka");

        // connect kafka only when kafkaConfig is set
        if (
            kafkaConfig?.brokerEndpoint &&
            kafkaConfig?.clientId &&
            kafkaConfig?.groupId
        ) {
            app.connectMicroservice(
                new KafkaConfigService(kafkaConfig).createClientOptions()
            );
            await app.startAllMicroservices();
            logger.info(
                `🚀  Kafka connected at ${kafkaConfig.brokerEndpoint}`,
                { context: "BootStrap" }
            );
        }

        // Swagger
        const swagger = JSON.parse(
            fs.readFileSync(__dirname + "/../public/swagger.json", "utf8")
        );
        SwaggerModule.setup("api-doc", app, swagger as OpenAPIObject);

        // CORS
        const corsWhiteList = "*";
        app.enableCors({
            origin: (origin, callback) => {
                if (
                    corsWhiteList.indexOf("*") !== -1 ||
                    corsWhiteList.indexOf(origin) !== -1
                ) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed"));
                }
            },
            allowedHeaders:
                "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, authorization",
            methods: "GET, PUT, POST, DELETE, UPDATE, OPTIONS",
            credentials: true
        });

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

        app.use("*splat", (req, res, next) => {
            const query = req.query || req.body || "";
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
    } catch (error: any) {
        logger.error(`❌  Error starting server, ${error.message}`, {
            context: "BootStrap"
        });
        process.exit();
    }
}

void bootstrap();
