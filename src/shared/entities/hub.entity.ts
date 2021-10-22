import { plainToClass } from "class-transformer";
import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";
import { HubDto } from "../interfaces/entity";

@Entity({
    name: "profiles"
})
export class Hub {
    @PrimaryColumn({
        name: "hub"
    })
    hub: string;

    @Column({
        name: "profile"
    })
    profile: string;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp"
    })
    createdAt: Date;

    toDto() {
        return plainToClass(HubDto, this);
    }

    public static of(params: Partial<Hub>): Hub {
        const hub = new Hub();

        Object.assign(hub, params);

        return hub;
    }
}
