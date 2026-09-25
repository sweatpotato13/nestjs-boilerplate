import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

/**
 * Builds CORS options from a comma-separated origin list.
 *
 * A `*` entry allows any origin without credentials, because browsers
 * reject credentialed responses for wildcard origins and reflecting
 * arbitrary origins with credentials exposes authenticated endpoints.
 * Otherwise only listed origins are allowed, with credentials.
 *
 * @param allowedOrigins Comma-separated origins, e.g. `https://a.com,https://b.com`
 * @returns CORS options for `app.enableCors`
 */
export function createCorsOptions(allowedOrigins: string): CorsOptions {
    const origins = allowedOrigins
        .split(",")
        .map(origin => origin.trim())
        .filter(Boolean);
    const allowAny = origins.includes("*");

    return {
        origin: allowAny ? "*" : origins,
        allowedHeaders:
            "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, authorization",
        methods: "GET, PUT, POST, DELETE, UPDATE, OPTIONS",
        credentials: !allowAny
    };
}
