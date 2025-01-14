import { ApiProperty } from "@nestjs/swagger";

import { UserRole } from "./user_role";

export class Role {
    @ApiProperty({ type: Number })
    id!: number;

    @ApiProperty({ type: String })
    name!: string;

    @ApiProperty({ type: String })
    description!: string;

    @ApiProperty({ isArray: true, type: () => UserRole })
    userRoles!: UserRole[];
}
