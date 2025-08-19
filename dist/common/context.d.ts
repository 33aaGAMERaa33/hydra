import { RouteDefinition } from "../core/definitions/route.definition";
export declare class Context {
    readonly route: RouteDefinition;
    private readonly data;
    constructor(data: {
        route: RouteDefinition;
    });
    saveData<T>(key: any, value: T): void;
    getData<T>(key: any): T | undefined;
}
