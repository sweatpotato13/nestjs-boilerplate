import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export function createCorsOptions(origins: string): CorsOptions {
    const allowedOrigins = origins
        .split(",")
        .map(origin => origin.trim())
        .filter(Boolean);
    const allowAnyOrigin = allowedOrigins.includes("*");
    return {
        origin: allowAnyOrigin ? "*" : allowedOrigins,
        allowedHeaders:
            "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, authorization",
        methods: "GET, PUT, POST, DELETE, UPDATE, OPTIONS",
        credentials: !allowAnyOrigin
    };
}
