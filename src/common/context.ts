import { RouteDefinition } from "../core/definitions/route.definition";

export class Context {
    readonly route: RouteDefinition;
    private readonly data: Map<any, any> = new Map();
    
    constructor(data: {
        route: RouteDefinition,
    }) {
        this.route = data.route;
    }
    
    saveData<T>(key: any, value: T) {
        this.data.set(key, value);
    }
    
    getData<T>(key: any): T | undefined {
        return this.data.get(key);
    }
}