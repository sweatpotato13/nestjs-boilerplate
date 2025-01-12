import { registerAs } from "@nestjs/config";

export default registerAs("mongoose", () => ({
    user: process.env.MONGODB_USER || "user",
    password: process.env.MONGODB_PW || "pw",
    host: process.env.MONGODB_HOST || "localhost",
    port: process.env.MONGODB_PORT || "27017",
    db: process.env.MONGODB_DB || "mongo"
}));
