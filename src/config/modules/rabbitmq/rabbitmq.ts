import { registerAs } from "@nestjs/config";

export default registerAs("rabbitmq", () => ({
    user: process.env.RABBITMQ_USER || "admin",
    password: process.env.RABBITMQ_PASSWORD || "admin",
    endpoint: process.env.RABBITMQ_ENDPOINT || "amqp://localhost:5672",
    queue: process.env.RABBITMQ_QUEUE || "default"
}));
