import { Hub } from "@src/shared/entities";
import { NotFoundException } from "@src/shared/models/error/http.error";
import { Repository, EntityRepository } from "typeorm";


@EntityRepository(Hub)
export class HubRepository extends Repository<Hub> {
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
                throw new NotFoundException(
                    `${profile} does not have any registered hub instances`,
                    {
                        context: `HubRepository`
                    }
                );

            return profileInstance;
        } catch (e) {
            throw e;
        }
    }
}
