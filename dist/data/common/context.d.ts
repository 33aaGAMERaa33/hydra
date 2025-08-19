import { HydraRequest } from "./hydra_request";
import { HydraResponse } from "./hydra_response";
export declare class Context {
    readonly req: HydraRequest;
    readonly res: HydraResponse;
    protected readonly data: Map<any, any>;
    constructor(data: {
        req: HydraRequest;
        res: HydraResponse;
    });
    saveData<T>(key: any, value: T): void;
    getData<T>(key: any): T | undefined;
}
