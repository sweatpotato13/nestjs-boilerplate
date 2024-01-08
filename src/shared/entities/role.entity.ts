import { plainToClass } from "class-transformer";
import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation
} from "typeorm";

import { RoleDto } from "../dtos";
import { UserRole } from "./user-role.entity";

@Entity("role", { schema: "public" })
export class Role {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;

    @Column("text", { name: "name" })
    name: string;

    @Column("text", { name: "description", nullable: true })
    description?: string;

    @OneToMany(() => UserRole, userRole => userRole.role)
    userRoles: Relation<UserRole[]>;

    toDto() {
        return plainToClass(RoleDto, this);
    }

    public static of(params: Partial<Role>): Role {
        const role = new Role();

        Object.assign(role, params);

        return role;
    }
}
