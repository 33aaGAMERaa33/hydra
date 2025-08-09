import { RouteDefinition } from "../core/definitions/route.definition";
import { HydraRequest } from "./hydra_request";
import { HydraResponse } from "./hydra_response";

export class Context {
    readonly req: HydraRequest;
    readonly res: HydraResponse;
    readonly route: RouteDefinition;
    protected redirected: boolean = false;
    protected readonly data: Map<any, any> = new Map();
    
    constructor(data: {
        route: RouteDefinition,
        req: HydraRequest,
        res: HydraResponse,
    }) {
        this.route = data.route;
        this.req = data.req;
        this.res = data.res;
    }
    
    saveData<T>(key: any, value: T) {
        this.data.set(key, value);
    }
    
    getData<T>(key: any): T | undefined {
        return this.data.get(key);
    }

    redirect(): void {
        this.redirected = true;
    }

    wasRedirected(): boolean {
        return this.redirected;
    }
}