import { ApiProperty } from "@nestjs/swagger";

import { Role } from "./role";
import { User } from "./user";

export class UserRole {
    @ApiProperty({ type: BigInt })
    id!: bigint;

    @ApiProperty({ type: String })
    userId!: string;

    @ApiProperty({ type: Number })
    roleId!: number;

    @ApiProperty({ type: Date })
    createdAt!: Date;

    @ApiProperty({ type: () => User })
    user!: User;

    @ApiProperty({ type: () => Role })
    role!: Role;
}
