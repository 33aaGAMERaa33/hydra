import { Context } from "vm";
import { HydraRequest } from "../common/hydra_request";
import { HydraResponse } from "../common/hydra_response";
import { RunHandlerArgs } from "../core/types/run_handler_args.type";

export class HandlerHelper {
    private constructor() {}

    static buildArgs = (context: Context, req: HydraRequest, res: HydraResponse): RunHandlerArgs => {
        return {
            req: req,
            res: res,
            body: req.body,
            query: req.query,
            context: context,
            headers: req.headers,
        };
    };
}