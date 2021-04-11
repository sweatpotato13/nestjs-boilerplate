import { NestFactory } from "@nestjs/core";

import { AppModule } from "./domains/app/app.module";
import { config } from "./config";
import { LoggerModule } from "./shared/modules/logger/logger.module";
import { LoggerService } from "./shared/modules/logger/logger.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const loggerService = app.select(LoggerModule).get(LoggerService);
    try {
        await app.listen(config.port, () => {
            !config.isProduction
                ? loggerService.info(
                      `🚀  Server ready at http://${config.host}:${config.port}`,
                      { context: "BootStrap" }
                  )
                : loggerService.info(
                      `🚀  Server is listening on port ${config.port}`,
                      { context: "BootStrap" }
                  );
            !config.isProduction &&
                loggerService.info(
                    `🚀  Subscriptions ready at ws://${config.host}:${config.port}`,
                    { context: "BootStrap" }
                );
        });
    } catch (error) {
        loggerService.error(`❌  Error starting server, ${error}`, {
            context: "BootStrap",
        });
        process.exit();
    }
}
bootstrap();
