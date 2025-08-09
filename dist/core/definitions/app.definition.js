"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDefinition = void 0;
class AppDefinition {
    instance;
    port;
    routeManager;
    controllers;
    injectables;
    constructor(data) {
        this.port = data.port;
        this.instance = data.instance;
        this.controllers = data.controllers;
        this.injectables = data.injectables;
        this.routeManager = data.routeManager;
    }
}
exports.AppDefinition = AppDefinition;
