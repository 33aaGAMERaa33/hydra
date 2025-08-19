import { AppContract } from "../../domain/contracts/app.contract";
import { RouteManager } from "../common/route_manager";
import { ControllerDefinition } from "./controller.definition";

export class AppDefinition {
    readonly app: AppContract;
    readonly port: number;
    readonly routeManager: RouteManager;
    readonly controllers: ControllerDefinition[];

    constructor(data: {
        app: AppContract,
        port: number,
        controllers: ControllerDefinition[]
    }) {
        this.app = data.app;
        this.port = data.port;
        this.controllers = data.controllers;
        this.routeManager = new RouteManager(this.controllers);
    }
}