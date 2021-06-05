import { Repository, EntityRepository } from "typeorm";
import { Hub } from "@common/entities/hub.entity";
import { IHubRepository } from "../interfaces/repository/hub-repository.interface";
import { ErrorResponse } from "../models/responses";

@EntityRepository(Hub)
export class HubRepository extends Repository<Hub> implements IHubRepository {
    async registerHub(data: Hub): Promise<Hub> {
        const hub = await this.save(
            super.create({
                ...data
            })
        );
        return hub;
    }

    async discardHub(data: Hub): Promise<boolean> {
        try {
            const hub = await super.remove(data);
            return true;
        } catch (err) {
            return false;
        }
    }

    async findHubByDid(clientDid: string): Promise<Hub> {
        const user = await super.findOne({ profile: clientDid });
        return user;
    }

    async getHubInstance(profile: string, hubDid: string): Promise<Hub> {
        try {
            const profileInstance = await super.findOne({
                profile: profile,
                hub: hubDid
            });

            if (!profileInstance)
                throw new ErrorResponse(
                    `${profile} does not have any registered hub instances`,
                    404
                );

            return profileInstance;
        } catch (e) {
            console.error("Exception at getHubInstance(): ", e);
            throw e;
        }
    }
}
