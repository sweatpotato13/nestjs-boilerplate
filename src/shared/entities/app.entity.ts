import { plainToClass } from "class-transformer";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

import { AppDto } from "../dtos";

@Index(["name", "version"], { unique: true })
@Entity("app", { schema: "public" })
export class App {
    @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
    id: string;

    @Column("text", { name: "name" })
    name: string;

    @Column("text", { name: "version" })
    version: string;

    @Column("timestamp with time zone", {
        name: "created_at",
        default: () => "now()"
    })
    createdAt: Date;

    @Column("timestamp with time zone", {
        name: "updated_at",
        default: () => "now()"
    })
    updatedAt: Date;

    toDto() {
        return plainToClass(AppDto, this);
    }

    public static of(params: Partial<App>): App {
        const app = new App();

        Object.assign(app, params);

        return app;
    }
}
