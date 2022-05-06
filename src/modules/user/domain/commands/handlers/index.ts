import { GetAuthMessageHandler } from "./get-auth-message.handler";
import { LoginHandler } from "./login.handler"
import { RefreshHandler } from "./refresh.handler"

export const CommandHandlers = [
    GetAuthMessageHandler,
    LoginHandler,
    RefreshHandler
];
