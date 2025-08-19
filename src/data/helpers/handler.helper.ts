
import { Context } from "../common/context";
import { HandlerParameters } from "../types/handler_parameters.type";

export class HandlerHelper {
    private constructor() {}

    static buildParameters = (context: Context): HandlerParameters => {
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