import { Client } from "@elastic/elasticsearch";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { ElasticsearchConfig } from "@src/config";

@Injectable()
export class ElasticsearchService {
    private readonly client: Client;

    constructor(
        @Inject(ElasticsearchConfig.KEY)
        private readonly config: ConfigType<typeof ElasticsearchConfig>
    ) {
        this.client = new Client({
            node: this.config.node
        });
    }
}
