"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerDefinition = void 0;
class ControllerDefinition {
    instance;
    routesDefinition;
    constructor(data) {
        this.instance = data.instance;
        this.routesDefinition = data.routesDefinition;
    }
}
exports.ControllerDefinition = ControllerDefinition;
