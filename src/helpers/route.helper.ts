import { Context } from "../common/context";
import { RunHandlerArgs } from "../core/types/run_handler_args.type";

export class HandlerHelper {
    private constructor() {}

    static buildArgs = (context: Context): RunHandlerArgs => {
        return {
            req: context.req,
            res: context.res,
            body: context.req.body,
            query: context.req.query,
            context: context,
            headers: context.req.headers,
        };
    };
}