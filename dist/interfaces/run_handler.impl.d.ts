import { RunHandlerArgs } from "../core/types/run_handler_args.type";
export interface RunHandlerImpl {
    runHandler(args: RunHandlerArgs): any;
}
