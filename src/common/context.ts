import { Route } from "./route";

export class Context {
    readonly route: Route;
    private readonly data: Map<any, any> = new Map();
    
    constructor(data: {
        route: Route,
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