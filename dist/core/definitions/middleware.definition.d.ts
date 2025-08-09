import { Definition } from "../../interfaces/definition.impl";
import { MiddlewareImpl } from "../../interfaces/middleware.impl";
import { RunHandlerImpl } from "../../interfaces/run_handler.impl";
import { Handler } from "../types/handler.type";
import { RunHandlerArgs } from "../types/run_handler_args.type";
export declare class MiddlewareDefinition implements Definition<MiddlewareImpl>, RunHandlerImpl {
    readonly instance: MiddlewareImpl;
    private readonly handler;
    private readonly handlerArgs;
    constructor(data: {
        instance: MiddlewareImpl;
        handler: Handler;
        handlerArgs: RunHandlerArgs;
    });
    runHandler: (parameters: RunHandlerArgs) => any;
}
