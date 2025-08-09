"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlerHelper = void 0;
class HandlerHelper {
    constructor() { }
    static buildArgs = (context, req, res) => {
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
exports.HandlerHelper = HandlerHelper;
