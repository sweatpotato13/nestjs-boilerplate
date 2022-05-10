import { plainToClass } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { RoleDto } from "../interfaces/entities";
import { UserRole } from "./user-role.entity";

@Entity("role", { schema: "boilerplate" })
export class Role {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;

    @Column("text", { name: "name" })
    name: string;

    @Column("text", { name: "description", nullable: true })
    description?: string;

    @OneToMany(() => UserRole, userRole => userRole.role)
    userRoles: UserRole[];

    toDto() {
        return plainToClass(RoleDto, this);
    }

    public static of(params: Partial<Role>): Role {
        const role = new Role();

        Object.assign(role, params);

        return role;
    }
}