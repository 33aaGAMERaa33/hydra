import { RouteImpl } from "../../interfaces/route.impl";
import { RunHandlerImpl } from "../../interfaces/run_handler.impl";
import { HttpMethod } from "../enums/http_method.enum";
import { HandlerParameters } from "../types/handler_parameters.type";

export class RouteDefinition implements RunHandlerImpl {
    readonly path: string;
    readonly route: RouteImpl;
    readonly method: HttpMethod;

    constructor(data: {
        path: string,
        route: RouteImpl,
        method: HttpMethod,
    }) {
        this.path = data.path;
        this.route = data.route;
        this.method = data.method;
    }

    runHandler(parameters: HandlerParameters): any {
        const args: any[] = [];

        for(const parameter in parameters) {
            
        }

        return this.route.handler(...args);
    }
}