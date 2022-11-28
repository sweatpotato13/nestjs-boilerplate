import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import {
    ElasticsearchModuleOptions,
    ElasticsearchOptionsFactory
} from "@nestjs/elasticsearch";
import { ElasticsearchConfig } from "@src/config";

@Injectable()
export class ElasticsearchConfigService implements ElasticsearchOptionsFactory {
    constructor(
        @Inject(ElasticsearchConfig.KEY)
        private config: ConfigType<typeof ElasticsearchConfig>
    ) {}

    createElasticsearchOptions(): ElasticsearchModuleOptions {
        const node = this.config.node;
        return { node };
    }
}
