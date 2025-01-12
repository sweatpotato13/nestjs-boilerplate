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

    public async index(index: string, document: any): Promise<void> {
        await this.client.index({ index, document });
    }

    public async search(index: string, query: any): Promise<any> {
        const result = await this.client.search({ index, body: query });
        return result;
    }
}
