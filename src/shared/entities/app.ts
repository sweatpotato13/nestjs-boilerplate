import { ApiProperty } from "@nestjs/swagger";

export class App {
    @ApiProperty({ type: BigInt })
    id!: bigint;

    @ApiProperty({ type: String })
    name!: string;

    @ApiProperty({ type: String })
    version!: string;

    @ApiProperty({ type: Date })
    createdAt!: Date;

    @ApiProperty({ type: Date })
    updatedAt!: Date;
}
