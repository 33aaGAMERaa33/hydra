"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
class Context {
    req;
    res;
    data = new Map();
    constructor(data) {
        this.req = data.req;
        this.res = data.res;
    }
    saveData(key, value) {
        this.data.set(key, value);
    }
    getData(key) {
        return this.data.get(key);
    }
}
exports.Context = Context;
