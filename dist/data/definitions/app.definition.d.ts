import { App } from "../common/app";
import { Context } from "../common/context";
import { RouteManager } from "../common/route_manager";
import { ControllerDefinition } from "./controller.definition";
import { RouteDefinition } from "./route.definition";
export declare class AppDefinition {
    readonly app: App;
    readonly port: number;
    readonly controllers: Map<string, ControllerDefinition>;
    readonly routeManager: RouteManager;
    constructor(data: {
        app: App;
        port: number;
        controllers: ControllerDefinition[];
    });
    findControllerAndRoute(context: Context): [ControllerDefinition, RouteDefinition] | undefined;
}
