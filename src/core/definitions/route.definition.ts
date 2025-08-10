import { RouteImpl } from "../../interfaces/route.impl";
import { RunHandlerImpl } from "../../interfaces/run_handler.impl";
import { HttpMethod } from "../enums/http_method.enum";
import { HandlerParameter } from "../types/handler_parameter.enum";
import { HandlerParameters } from "../types/handler_parameters.type";

export class RouteDefinition implements RunHandlerImpl {
    readonly path: string;
    readonly route: RouteImpl;
    readonly method: HttpMethod;
    protected readonly parameters: HandlerParameters;

    constructor(data: {
        path: string,
        route: RouteImpl,
        method: HttpMethod,
        parameters: HandlerParameters
    }) {
        this.path = data.path;
        this.route = data.route;
        this.method = data.method;
        this.parameters = data.parameters;
    }

    runHandler(parameters: HandlerParameters): any {
        const args: any[] = [];

        for(const parameter in parameters) {
            const value = parameters[parameter as HandlerParameter];

            args[this.parameters[parameter as HandlerParameter]] = value;
        }

        return this.route.handler(...args);
    }
}