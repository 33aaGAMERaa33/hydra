"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDefinition = void 0;
const route_manager_1 = require("../common/route_manager");
class AppDefinition {
    app;
    port;
    controllers;
    routeManager = new route_manager_1.RouteManager();
    constructor(data) {
        this.app = data.app;
        this.port = data.port;
        this.controllers = new Map();
    }
    findControllerAndRoute(context) {
        return undefined;
    }
}
exports.AppDefinition = AppDefinition;
