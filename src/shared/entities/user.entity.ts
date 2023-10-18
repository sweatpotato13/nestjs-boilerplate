import { plainToClass } from "class-transformer";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn
} from "typeorm";

import { UserDto } from "../dtos";
import { UserRole } from "./user-role.entity";

@Entity("user", { schema: "public" })
export class User {
    @PrimaryGeneratedColumn("uuid", {
        name: "id"
    })
    id: string;

    @Column("text", {
        name: "email"
    })
    email: string;

    @Column("text", {
        name: "name"
    })
    name: string;

    @Column("text", {
        name: "provider"
    })
    provider: string;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp"
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: "updated_at",
        type: "timestamp"
    })
    updatedAt: Date;

    @OneToMany(() => UserRole, userRole => userRole.user, {
        eager: true
    })
    userRoles: Relation<UserRole[]>;

    toDto() {
        return plainToClass(UserDto, this);
    }

    public static of(params: Partial<User>): User {
        const user = new User();

        Object.assign(user, params);

        return user;
    }
}
