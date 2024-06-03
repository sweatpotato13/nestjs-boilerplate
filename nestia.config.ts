import { INestiaConfig } from "@nestia/sdk";

export const NESTIA_CONFIG: INestiaConfig = {
    simulate: true,
    input: "src/**/*.controller.ts",
    swagger: {
        output: "public/swagger.json",
        servers: [
            {
                url: "http://localhost:8000",
                description: "Local Server"
            }
        ],
        decompose: true,
        security: {
            bearer: {
                type: "apiKey",
                name: "Authorization",
                in: "header"
            }
        }
    }
};
export default NESTIA_CONFIG;
