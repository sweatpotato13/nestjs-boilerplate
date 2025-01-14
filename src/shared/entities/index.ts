/* eslint-disable @typescript-eslint/no-namespace */
import { App as _App } from "./app";
import { Role as _Role } from "./role";
import { User as _User } from "./user";
import { UserRole as _UserRole } from "./user_role";

export namespace PrismaModel {
    export class App extends _App {}
    export class User extends _User {}
    export class Role extends _Role {}
    export class UserRole extends _UserRole {}

    export const extraModels = [App, User, Role, UserRole];
}
