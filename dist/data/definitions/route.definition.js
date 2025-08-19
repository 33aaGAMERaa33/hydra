"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteDefinition = void 0;
class RouteDefinition {
    path;
    route;
    method;
    parameters;
    constructor(data) {
        this.path = data.path;
        this.route = data.route;
        this.method = data.method;
        this.parameters = data.parameters;
    }
    runHandler(parameters) {
        const args = [];
        for (const parameter in parameters) {
            const value = parameters[parameter];
            args[this.parameters[parameter]] = value;
        }
        return this.route.handler(...args);
    }
    equalsPath(definition) {
        return this.path === definition.path && this.method === definition.method;
    }
}
exports.RouteDefinition = RouteDefinition;
