import { plainToClass } from "class-transformer";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation
} from "typeorm";

import { UserRoleDto } from "../dtos";
import { Role } from "./role.entity";
import { User } from "./user.entity";

@Entity("user_role", { schema: "public" })
export class UserRole {
    @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
    id: number;

    @Column("uuid", { name: "user_id" })
    userId: string;

    @Column("integer", { name: "role_id" })
    roleId: number;

    @ManyToOne(() => Role, role => role.userRoles, {
        eager: true,
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT"
    })
    @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
    role: Relation<Role>;

    @ManyToOne(() => User, user => user.userRoles, {
        cascade: true,
        onDelete: "CASCADE",
        orphanedRowAction: "delete"
    })
    @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
    user: Relation<User>;

    @CreateDateColumn({
        type: "timestamp",
        name: "created_at",
        default: () => "now()"
    })
    createdAt: Date;

    toDto() {
        return plainToClass(UserRoleDto, this);
    }

    public static of(params: Partial<UserRole>): UserRole {
        const userRole = new UserRole();

        Object.assign(userRole, params);

        return userRole;
    }
}
