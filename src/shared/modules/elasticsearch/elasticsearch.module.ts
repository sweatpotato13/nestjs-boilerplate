import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ElasticsearchConfig } from "@src/config";

import { ElasticsearchService } from "./elasticsearch.service";

@Module({
    imports: [ConfigModule.forFeature(ElasticsearchConfig)],
    providers: [
        {
            provide: "ElasticsearchService",
            useClass: ElasticsearchService
        }
    ],
    exports: ["ElasticsearchService"]
})
export class ElasticsearchModule {}
