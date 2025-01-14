import { ApiProperty } from "@nestjs/swagger";

import { UserRole } from "./user_role";

export class User {
    @ApiProperty({ type: String })
    id!: string;

    @ApiProperty({ type: String })
    email!: string;

    @ApiProperty({ type: String })
    name!: string;

    @ApiProperty({ type: String })
    provider!: string;

    @ApiProperty({ type: Date })
    createdAt!: Date;

    @ApiProperty({ type: Date })
    updatedAt!: Date;

    @ApiProperty({ isArray: true, type: () => UserRole })
    userRoles!: UserRole[];
}
