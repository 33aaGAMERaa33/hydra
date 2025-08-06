"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HydraRequest = void 0;
class HydraRequest {
    url;
    body;
    httpMethod;
    query;
    req;
    constructor(data) {
        this.req = data.req;
        this.url = data.url;
        this.body = data.body;
        this.httpMethod = data.httpMethod;
        this.query = data.query;
    }
    get headers() {
        return this.req.headers;
    }
}
exports.HydraRequest = HydraRequest;
