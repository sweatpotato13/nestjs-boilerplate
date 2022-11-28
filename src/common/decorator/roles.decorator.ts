import { SetMetadata } from "@nestjs/common";
import { Role } from "@src/shared/models/enum";

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
