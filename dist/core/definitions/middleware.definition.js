"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareDefinition = void 0;
class MiddlewareDefinition {
    instance;
    handler;
    handlerArgs;
    constructor(data) {
        this.handler = data.handler;
        this.instance = data.instance;
        this.handlerArgs = data.handlerArgs;
    }
    runHandler(args) {
        console.log("OKAY");
    }
}
exports.MiddlewareDefinition = MiddlewareDefinition;
