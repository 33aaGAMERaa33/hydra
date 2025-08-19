import { ControllerContract } from "../../domain/contracts/controller.contract";
import { RouteDefinition } from "./route.definition";

export class ControllerDefinition {
    readonly controller: ControllerContract;
    readonly routes: RouteDefinition[];

    constructor(data: {
        controller: ControllerContract,
        routes: RouteDefinition[],
    }) {
        this.routes = data.routes;
        this.controller = data.controller;
    }
}