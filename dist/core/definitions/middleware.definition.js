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
    runHandler = (parameters) => {
        const args = [];
        for (const key in this.handlerArgs) {
            const parameterIndex = this.handlerArgs[key];
            const parameterValue = parameters[key];
            args[parameterIndex] = parameterValue;
        }
        return this.handler(...args);
    };
}
exports.MiddlewareDefinition = MiddlewareDefinition;
