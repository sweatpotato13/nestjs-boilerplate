import { DiscardHubDto } from "../dtos/discard-hub.dto";
import { RegisterHubDto } from "../dtos/register-hub.dto";

export interface IHubService {
    registerHub(data: RegisterHubDto): Promise<any>;
    discardHub(data: DiscardHubDto): Promise<any>;
}
