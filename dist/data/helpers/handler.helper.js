"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlerHelper = void 0;
class HandlerHelper {
    constructor() { }
    static buildParameters = (context) => {
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
exports.HandlerHelper = HandlerHelper;
