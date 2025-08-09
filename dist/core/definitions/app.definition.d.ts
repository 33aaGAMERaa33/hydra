import { RouteManager } from "../../common/route_manager";
import { Definition } from "../../interfaces/definition.impl";
import { ControllerDefinition } from "./controller.definition";
import { InjectableDefinition } from "./injectable.definition";
export declare class AppDefinition<T = any> implements Definition<T> {
    readonly instance: T;
    readonly port: number;
    readonly routeManager: RouteManager;
    readonly controllers: ControllerDefinition[];
    readonly injectables: InjectableDefinition[];
    constructor(data: {
        port: number;
        instance: T;
        routeManager: RouteManager;
        controllers: ControllerDefinition[];
        injectables: InjectableDefinition[];
    });
}
