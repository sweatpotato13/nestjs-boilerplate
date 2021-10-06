import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";


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
}
