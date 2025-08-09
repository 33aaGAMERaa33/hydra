import { Equals } from "../../interfaces/equals.impl";
import { HttpMethod } from "../types/http_method.enum";
import { Handler } from "../types/handler.type";
import { RouteHandlerParameter } from "../types/route_handler_parameter.enum";
import { RouteHandlerParameters } from "../types/route_handler_parameters.type";
import { RunHandlerArgs } from "../types/run_handler_args.type";
import { MiddlewareDefinition } from "./middleware.definition";
import { RunHandlerImpl } from "../../interfaces/run_handler.impl";

export class RouteDefinition implements Equals<RouteDefinition>, RunHandlerImpl {
    protected readonly path: string;
    protected readonly method: HttpMethod;
    protected readonly handler: Handler;
    readonly afterHandlerMiddlewares: MiddlewareDefinition[];
    readonly beforeHandlerMiddlewares: MiddlewareDefinition[];
    protected readonly handlerArgs: RouteHandlerParameters;

    constructor(data: {
        path: string,
        method: HttpMethod,
        handler: Handler,
        handlerArgs: RouteHandlerParameters,
        beforeHandlerMiddlewares: MiddlewareDefinition[],
        afterHandlerMiddlewares: MiddlewareDefinition[]
    }) {
        this.path = data.path;
        this.method = data.method;
        this.handler = data.handler;
        this.handlerArgs = data.handlerArgs;
        this.afterHandlerMiddlewares = data.afterHandlerMiddlewares;
        this.beforeHandlerMiddlewares = data.beforeHandlerMiddlewares;
    }

    getPath = () => this.path;
    getMethod = () => this.method;
    bindHandler = (instance: Object) => this.handler.bind(instance);

    runHandler = (parameters: RunHandlerArgs): any => {
        const args: any[] = [];

        for(const key in this.handlerArgs) {
            const parameterIndex = this.handlerArgs[key as RouteHandlerParameter];
            const parameterValue = parameters[key as RouteHandlerParameter]

            args[parameterIndex] = parameterValue;
        }

        return this.handler(...args);
    };

    cloneWith(data?: {
        path?: string;
        method?: HttpMethod,
        handler?: (...args: any[]) => any,
        handlerArgs?: RouteHandlerParameters,
        beforeHandlerMiddlewares?: MiddlewareDefinition[],
        afterHandlerMiddlewares?: MiddlewareDefinition[],
    }): RouteDefinition {
        return new RouteDefinition({
            path: data?.path ?? this.path,
            method: data?.method ?? this.method,
            handler: data?.handler ?? this.handler,
            handlerArgs: data?.handlerArgs ?? this.handlerArgs,
            afterHandlerMiddlewares: data?.afterHandlerMiddlewares ?? this.afterHandlerMiddlewares,
            beforeHandlerMiddlewares: data?.beforeHandlerMiddlewares ?? this.beforeHandlerMiddlewares,
        });
    }

    equals(other: RouteDefinition): boolean {
        return this.path === other.path && this.method === other.method;
    }

    forThis(path: string, method: HttpMethod) {
        return this.path === path && this.method === method;
    }
}