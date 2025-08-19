import { Context } from "vm";
import { HydraRequest } from "../common/hydra_request";
import { HydraResponse } from "../common/hydra_response";
import { RunHandlerArgs } from "../core/types/run_handler_args.type";
export declare class HandlerHelper {
    private constructor();
    static buildArgs: (context: Context, req: HydraRequest, res: HydraResponse) => RunHandlerArgs;
}
