import { HydraRequest } from "./hydra_request";
import { HydraResponse } from "./hydra_response";

export class Context {
    readonly req: HydraRequest;
    readonly res: HydraResponse;
    protected readonly data: Map<any, any> = new Map();
    
    constructor(data: {
        req: HydraRequest,
        res: HydraResponse,
    }) {
        this.req = data.req;
        this.res = data.res;
    }
    
    saveData<T>(key: any, value: T) {
        this.data.set(key, value);
    }
    
    getData<T>(key: any): T | undefined {
        return this.data.get(key);
    }
}