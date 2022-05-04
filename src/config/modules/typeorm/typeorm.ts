import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export default registerAs(
    "typeorm",
    (): TypeOrmModuleOptions => ({
        type: "postgres",
        host: process.env.POSTGRES_HOST || "localhost",
        port: parseInt(process.env.POSTGRES_PORT || "5432"),
        username: process.env.POSTGRES_USER || "postgres",
        password:
            process.env.POSTGRES_PASSWORD ||
            "12cad546caac9631353b91e9072c6d2a5800bf41bc531824deac1fea81621826",
        database: process.env.POSTGRES_DB || "postgres",
        synchronize: process.env.POSTGRES_SYNC === "true",
        logging: true,
        entities: [__dirname + "/**/**.entity{.ts,.js}"]
    })
);
