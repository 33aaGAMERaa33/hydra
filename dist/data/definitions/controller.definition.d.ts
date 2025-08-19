import { ControllerContract } from "../../domain/contracts/controller.contract";
import { HttpMethod } from "../enums/http_method.enum";
import { RouteDefinition } from "./route.definition";
export declare class ControllerDefinition {
    readonly controller: ControllerContract;
    readonly routes: Map<string, Map<HttpMethod, RouteDefinition>>;
    constructor(data: {
        controller: ControllerContract;
        routes: RouteDefinition[];
    });
    findRoute(path: string, method: HttpMethod): RouteDefinition | undefined;
}
