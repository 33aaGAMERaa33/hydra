import { RouteContract } from "../../domain/contracts/route.contract";
import { RunHandlerImpl } from "../interfaces/run_handler.impl";
import { HttpMethod } from "../enums/http_method.enum";
import { HandlerParameters } from "../types/handler_parameters.type";
export declare class RouteDefinition implements RunHandlerImpl {
    readonly path: string;
    readonly route: RouteContract;
    readonly method: HttpMethod;
    protected readonly parameters: HandlerParameters;
    constructor(data: {
        path: string;
        route: RouteContract;
        method: HttpMethod;
        parameters: HandlerParameters;
    });
    runHandler(parameters: HandlerParameters): any;
    equalsPath(definition: RouteDefinition): boolean;
}
