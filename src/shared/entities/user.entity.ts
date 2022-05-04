import { plainToClass } from "class-transformer";
import {
    Entity,
    Column,
    CreateDateColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { UserDto } from "../interfaces/entities";
import { UserRole } from "./user-role.entity";

@Entity("user", { schema: "boilerplate" })
export class User {
    @PrimaryGeneratedColumn("uuid", {
        name: "id",
    })
    id: string;

    @Column("text", {
        name: "account",
    })
    account: string;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp",
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: "updated_at",
        type: "timestamp",
    })
    updatedAt: Date;

    @OneToMany(() => UserRole, userRole => userRole.user, {
        eager: true,
    })
    userRoles: UserRole[];

    toDto() {
        return plainToClass(UserDto, this);
    }

    public static of(params: Partial<User>): User {
        const user = new User();

        Object.assign(user, params);

        return user;
    }
}