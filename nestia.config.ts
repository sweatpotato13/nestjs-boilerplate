import { INestiaConfig } from "@nestia/sdk";

export const NESTIA_CONFIG: INestiaConfig = {
    simulate: true,
    input: {
        include: ["src/**/*.controller.ts"],
        // TemplateModule is a scaffold that AppModule does not import
        exclude: ["src/modules/template/**"]
    },
    output: "sdk",
    swagger: {
        output: "public/swagger.json",
        openapi: "3.1",
        servers: [
            {
                url: "http://localhost:8000",
                description: "Local Server"
            }
        ],
        decompose: true,
        beautify: true,
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
