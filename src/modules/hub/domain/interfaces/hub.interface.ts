import { RegisterHubDto, DiscardHubDto } from "../dtos";

export interface IHubService {
    healthCheck(): Promise<any>;
    registerHub(data: RegisterHubDto): Promise<any>;
    discardHub(data: DiscardHubDto): Promise<any>;
}
