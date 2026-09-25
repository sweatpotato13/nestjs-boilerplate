import express from "express";
import request from "supertest";

import { queryLengthLimit } from "./query-length.middleware";

function createApp(maxLength: number): express.Express {
    const app = express();
    app.use(queryLengthLimit(maxLength));
    app.get("/", (_req, res) => {
        res.send("ok");
    });
    return app;
}

describe("queryLengthLimit", () => {
    it("rejects a query string longer than the limit with 414", async () => {
        const res = await request(createApp(10)).get(`/?q=${"a".repeat(9)}`);

        expect(res.status).toBe(414);
    });

    it("passes a query string at the limit", async () => {
        const res = await request(createApp(10)).get(`/?q=${"a".repeat(8)}`);

        expect(res.status).toBe(200);
    });

    it("rejects a long nested query string", async () => {
        const res = await request(createApp(10)).get(
            `/?a[b]=${"a".repeat(20)}`
        );

        expect(res.status).toBe(414);
    });

    it("passes a request without a query string", async () => {
        const res = await request(createApp(10)).get("/");

        expect(res.status).toBe(200);
    });
});
