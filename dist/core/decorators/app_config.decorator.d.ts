import { RouteManager } from "../../common/route_manager";
import { MiddlewareImpl } from "../../interfaces/middleware.impl";
import { ClassConstructor } from "../types/class_constructor.type";
export declare function AppConfig<T>(data: {
    port: (instance: T) => number;
    routeManager?: RouteManager;
    controllers?: ClassConstructor[];
    injectables?: ClassConstructor[];
    middlewares?: ClassConstructor<MiddlewareImpl>[];
}): <T_1 extends ClassConstructor>(constructor: T_1) => {
    new (...args: any[]): {};
} & T_1;
