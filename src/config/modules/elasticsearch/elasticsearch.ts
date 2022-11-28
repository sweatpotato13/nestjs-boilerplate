import { registerAs } from "@nestjs/config";

export default registerAs("es", () => ({
    node: process.env.ELASTICSEARCH_NODE || "http://127.0.0.1:9200"
}));
