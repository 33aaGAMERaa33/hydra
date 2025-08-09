import { Definition } from "../../interfaces/definition.impl";
import { MiddlewareImpl } from "../../interfaces/middleware.impl";
import { RunHandlerImpl } from "../../interfaces/run_handler.impl";
import { Handler } from "../types/handler.type";
import { RunHandlerArgs } from "../types/run_handler_args.type";

export class MiddlewareDefinition implements Definition<MiddlewareImpl>, RunHandlerImpl {
    readonly instance: MiddlewareImpl;
    private readonly handler: Handler;
    private readonly handlerArgs: RunHandlerArgs;

    constructor(data: {
        instance: MiddlewareImpl,
        handler: Handler,
        handlerArgs: RunHandlerArgs,
    }) {
        this.handler = data.handler;
        this.instance = data.instance;
        this.handlerArgs = data.handlerArgs;
    }

    runHandler(args: RunHandlerArgs): any {
        console.log("OKAY");
    }
}