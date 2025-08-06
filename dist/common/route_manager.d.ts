import { ControllerImplicitImpl } from "../interfaces/controller_implicit.impl";
import { MiddlewareImpl } from "../interfaces/middleware.impl";
import { HttpMethod } from "../types/http_method.enum";
import { HydraRequest } from "./hydra_request";
import { HydraResponse } from "./hydra_response";
import { Route } from "./route";
export declare class RouteManager {
    routeHandler(req: HydraRequest, res: HydraResponse, controllers: ControllerImplicitImpl[], middlewares: MiddlewareImpl[]): Promise<void>;
    protected getRouteMiddlewares(controller: ControllerImplicitImpl, route: Route, middlewares: MiddlewareImpl[]): MiddlewareImpl[];
    protected routeException(res: HydraResponse, e: any): void;
    protected findRoute(controllers: ControllerImplicitImpl[], path: string, httpMethod: HttpMethod): [ControllerImplicitImpl, Route] | undefined;
}
