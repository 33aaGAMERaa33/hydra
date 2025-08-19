"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerDefinition = void 0;
class ControllerDefinition {
    controller;
    routes;
    constructor(data) {
        this.routes = new Map();
        this.controller = data.controller;
        for (const route of data.routes) {
            if (!this.routes.has(route.path)) {
                this.routes.set(route.path, new Map());
            }
            this.routes.get(route.path).set(route.method, route);
        }
    }
    findRoute(path, method) {
        return this.routes.get(path)?.get(method);
    }
}
exports.ControllerDefinition = ControllerDefinition;
