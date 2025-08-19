import { Equals } from "../../interfaces/equals.impl";
import { HttpMethod } from "../types/http_method.enum";
import { Handler } from "../types/handler.type";
import { RouteHandlerParameters } from "../types/route_handler_parameters.type";
import { RunHandlerArgs } from "../types/run_handler_args.type";
import { MiddlewareDefinition } from "./middleware.definition";
import { RunHandlerImpl } from "../../interfaces/run_handler.impl";
export declare class RouteDefinition implements Equals<RouteDefinition>, RunHandlerImpl {
    protected readonly path: string;
    protected readonly method: HttpMethod;
    protected readonly handler: Handler;
    readonly afterHandlerMiddlewares: MiddlewareDefinition[];
    readonly beforeHandlerMiddlewares: MiddlewareDefinition[];
    protected readonly handlerArgs: RouteHandlerParameters;
    constructor(data: {
        path: string;
        method: HttpMethod;
        handler: Handler;
        handlerArgs: RouteHandlerParameters;
        beforeHandlerMiddlewares: MiddlewareDefinition[];
        afterHandlerMiddlewares: MiddlewareDefinition[];
    });
    getPath: () => string;
    getMethod: () => HttpMethod;
    bindHandler: (instance: Object) => Handler;
    runHandler: (parameters: RunHandlerArgs) => any;
    cloneWith(data?: {
        path?: string;
        method?: HttpMethod;
        handler?: (...args: any[]) => any;
        handlerArgs?: RouteHandlerParameters;
        beforeHandlerMiddlewares?: MiddlewareDefinition[];
        afterHandlerMiddlewares?: MiddlewareDefinition[];
    }): RouteDefinition;
    equals(other: RouteDefinition): boolean;
    forThis(path: string, method: HttpMethod): boolean;
}
