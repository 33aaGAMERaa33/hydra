import { Route } from "./route";
export declare class Context {
    readonly route: Route;
    private readonly data;
    constructor(data: {
        route: Route;
    });
    saveData<T>(key: any, value: T): void;
    getData<T>(key: any): T | undefined;
}
