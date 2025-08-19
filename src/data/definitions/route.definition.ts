import { RouteContract } from "../../domain/contracts/route.contract";
import { RunHandlerImpl } from "../interfaces/run_handler.impl";
import { HttpMethod } from "../enums/http_method.enum";
import { HandlerParameter } from "../types/handler_parameter.enum";
import { HandlerParameters } from "../types/handler_parameters.type";

export class RouteDefinition implements RunHandlerImpl {
    readonly path: string;
    readonly method: HttpMethod;
    readonly route: RouteContract;
    protected readonly parameters: HandlerParameters;

    constructor(data: {
        path: string,
        route: RouteContract,
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

    equalsPath(definition: RouteDefinition) {
        return this.path === definition.path && this.method === definition.method;
    }
}