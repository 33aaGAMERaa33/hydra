import { Definition } from "../../interfaces/definition.impl";
import { RouteDefinition } from "./route.definition";
export declare class ControllerDefinition<T = any> implements Definition<T> {
    readonly instance: T;
    readonly routesDefinition: RouteDefinition[];
    constructor(data: {
        instance: T;
        routesDefinition: RouteDefinition[];
    });
}
