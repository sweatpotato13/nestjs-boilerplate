import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";

import { IHub } from "./interfaces/hub.interface";

@Entity({
    name: "profiles"
})
export class Hub implements IHub {
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
}
