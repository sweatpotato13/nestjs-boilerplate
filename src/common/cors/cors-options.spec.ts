import { Controller, Get, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { createCorsOptions } from "./cors-options";

@Controller()
class PingController {
    @Get()
    ping(): string {
        return "pong";
    }
}

async function createApp(allowedOrigins: string): Promise<INestApplication> {
    const moduleRef = await Test.createTestingModule({
        controllers: [PingController]
    }).compile();
    const app = moduleRef.createNestApplication({ logger: false });
    app.enableCors(createCorsOptions(allowedOrigins));
    await app.init();
    return app;
}

describe("createCorsOptions", () => {
    let app: INestApplication;

    afterEach(async () => {
        await app.close();
    });

    it("allows any origin without credentials for a wildcard", async () => {
        app = await createApp("*");

        const res = await request(app.getHttpServer())
            .get("/")
            .set("Origin", "https://evil.example");

        expect(res.headers["access-control-allow-origin"]).toBe("*");
        expect(res.headers["access-control-allow-credentials"]).toBeUndefined();
    });

    it("reflects a listed origin with credentials", async () => {
        app = await createApp("https://a.example");

        const res = await request(app.getHttpServer())
            .get("/")
            .set("Origin", "https://a.example");

        expect(res.headers["access-control-allow-origin"]).toBe(
            "https://a.example"
        );
        expect(res.headers["access-control-allow-credentials"]).toBe("true");
    });

    it("omits CORS headers for an unlisted origin without failing", async () => {
        app = await createApp("https://a.example");

        const res = await request(app.getHttpServer())
            .get("/")
            .set("Origin", "https://evil.example");

        expect(res.status).toBe(200);
        expect(res.headers["access-control-allow-origin"]).toBeUndefined();
    });

    it("trims entries in a comma-separated list", async () => {
        app = await createApp(" https://a.example , https://b.example ");

        const res = await request(app.getHttpServer())
            .get("/")
            .set("Origin", "https://b.example");

        expect(res.headers["access-control-allow-origin"]).toBe(
            "https://b.example"
        );
    });

    it("serves requests without an Origin header", async () => {
        app = await createApp("https://a.example");

        const res = await request(app.getHttpServer()).get("/");

        expect(res.status).toBe(200);
        expect(res.text).toBe("pong");
    });
});
