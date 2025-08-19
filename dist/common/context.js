"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
class Context {
    route;
    data = new Map();
    constructor(data) {
        this.route = data.route;
    }
    saveData(key, value) {
        this.data.set(key, value);
    }
    getData(key) {
        return this.data.get(key);
    }
}
exports.Context = Context;
