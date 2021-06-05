import { Hub } from "@src/common/entities";

export interface IHubRepository {
    registerHub(data: Hub): Promise<Hub>;
    discardHub(data: Hub): Promise<boolean>;
    findHubByDid(clientDid: string): Promise<Hub>;
    getHubInstance(profile: string, hubDid: string): Promise<Hub>;
}
