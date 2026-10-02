import { Test } from "@nestjs/testing";
import request from "supertest";

import { createCorsOptions } from "./cors";

it.each([
    ["*", "https://client.example", "*", undefined],
    [
        " https://client.example, https://second.example ",
        "https://client.example",
        "https://client.example",
        "true"
    ],
    ["https://client.example", "https://untrusted.example", undefined, "true"],
    ["https://client.example,*", "https://untrusted.example", "*", undefined]
])(
    "applies CORS origins %s to %s",
    async (origins, origin, allowedOrigin, credentials) => {
        const module = await Test.createTestingModule({}).compile();
        const app = module.createNestApplication();
        app.enableCors(createCorsOptions(origins));
        try {
            await app.init();
            const response = await request(app.getHttpServer())
                .options("/users")
                .set("Origin", origin)
                .set("Access-Control-Request-Method", "GET")
                .set("Access-Control-Request-Headers", "authorization")
                .expect(204);
            expect(response.headers["access-control-allow-origin"]).toBe(
                allowedOrigin
            );
            expect(response.headers["access-control-allow-credentials"]).toBe(
                credentials
            );
            expect(response.headers["access-control-allow-headers"]).toContain(
                "authorization"
            );
        } finally {
            await app.close();
        }
    }
);
