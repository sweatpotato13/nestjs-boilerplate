import { registerAs } from "@nestjs/config";

export default registerAs("kafka", () => ({
    brokerEndpoint: process.env.KAFKA_BROKER_ENDPOINT || "localhost:9092",
    clientId: process.env.KAFKA_CLIENT_ID || "client",
    groupId: process.env.KAFKA_GROUP_ID || "ura-consumer-1337"
}));
