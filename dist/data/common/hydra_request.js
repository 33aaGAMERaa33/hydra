"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HydraRequest = void 0;
class HydraRequest {
    url;
    body;
    method;
    query;
    req;
    constructor(data) {
        this.req = data.req;
        this.url = data.url;
        this.body = data.body;
        this.method = data.method;
        this.query = data.query;
    }
    get headers() {
        return this.req.headers;
    }
}
exports.HydraRequest = HydraRequest;
