import { HydraRequest } from "./hydra_request";
import { HydraResponse } from "./hydra_response";
import { HttpMethod } from "../core/types/http_method.enum";
import { ControllerDefinition } from "../core/definitions/controller.definition";
import { RouteDefinition } from "../core/definitions/route.definition";
export declare class RouteManager {
    protected routeCache: Map<string, [ControllerDefinition, RouteDefinition]>;
    routeHandler(req: HydraRequest, res: HydraResponse, controllers: ControllerDefinition[]): Promise<void>;
    protected routeException(res: HydraResponse, e: any): void;
    protected findRoute(controllers: ControllerDefinition[], path: string, httpMethod: HttpMethod): [ControllerDefinition, RouteDefinition] | undefined;
}
