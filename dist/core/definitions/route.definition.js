"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteDefinition = void 0;
class RouteDefinition {
    path;
    method;
    handler;
    afterHandlerMiddlewares;
    beforeHandlerMiddlewares;
    handlerArgs;
    constructor(data) {
        this.path = data.path;
        this.method = data.method;
        this.handler = data.handler;
        this.handlerArgs = data.handlerArgs;
        this.afterHandlerMiddlewares = data.afterHandlerMiddlewares;
        this.beforeHandlerMiddlewares = data.beforeHandlerMiddlewares;
    }
    getPath = () => this.path;
    getMethod = () => this.method;
    bindHandler = (instance) => this.handler.bind(instance);
    runHandler = (parameters) => {
        const args = [];
        for (const key in this.handlerArgs) {
            const parameterIndex = this.handlerArgs[key];
            const parameterValue = parameters[key];
            args[parameterIndex] = parameterValue;
        }
        return this.handler(...args);
    };
    cloneWith(data) {
        return new RouteDefinition({
            path: data?.path ?? this.path,
            method: data?.method ?? this.method,
            handler: data?.handler ?? this.handler,
            handlerArgs: data?.handlerArgs ?? this.handlerArgs,
            afterHandlerMiddlewares: data?.afterHandlerMiddlewares ?? this.afterHandlerMiddlewares,
            beforeHandlerMiddlewares: data?.beforeHandlerMiddlewares ?? this.beforeHandlerMiddlewares,
        });
    }
    equals(other) {
        return this.path === other.path && this.method === other.method;
    }
    forThis(path, method) {
        return this.path === path && this.method === method;
    }
}
exports.RouteDefinition = RouteDefinition;
