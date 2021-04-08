import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";

@Injectable()
export class AsyncLocalStorageService extends AsyncLocalStorage<
    Record<string, any>
> {}
