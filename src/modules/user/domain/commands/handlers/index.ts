import { DeregisterHandler } from "./deregister.handler";
import { GetAuthMessageHandler } from "./get-auth-message.handler";
import { LoginHandler } from "./login.handler";
import { RefreshHandler } from "./refresh.handler";
import { RegisterHandler } from "./register.handler";

export const CommandHandlers = [
    GetAuthMessageHandler,
    LoginHandler,
    RefreshHandler,
    RegisterHandler,
    DeregisterHandler
];
