import { App } from "../../common/app";
import { ControllerCache } from "../../common/controller_cache";
import { RouteManager } from "../../common/route_manager";
import { ControllerDefinition } from "./controller.definition";

export class AppDefinition {
    readonly app: App;
    readonly port: number;
    readonly controllers: ControllerDefinition[];
    readonly routeManager: RouteManager = new RouteManager();
    readonly controllerCache: ControllerCache = new ControllerCache();

    constructor(data: {
        app: App,
        port: number,
        controllers: ControllerDefinition[]
    }) {
        this.app = data.app;
        this.port = data.port;
        this.controllers = data.controllers;

        for(const controller of data.controllers) {
            this.controllerCache.add(controller.prefix, controller);
        }
    }

    findController(prefix: string): ControllerDefinition | undefined {
        return this.controllerCache.get(prefix);
    }
}