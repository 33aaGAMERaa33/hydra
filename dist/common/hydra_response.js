"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HydraResponse = void 0;
class HydraResponse {
    res;
    constructor(res) {
        this.res = res;
    }
    setHeaders(headers) {
        for (const [name, value] of Object.entries(headers)) {
            this.res.setHeader(name, value);
        }
    }
    getHeaders() {
        return this.res.getHeaders();
    }
    setHeader(header) {
        this.res.setHeader(header.name, header.value);
    }
    getHeader(name) {
        return this.res.getHeader(name);
    }
    setStatusCode(status) {
        this.res.statusCode = status;
    }
    sendResponse(contentValue) {
        this.res.end(contentValue);
    }
}
exports.HydraResponse = HydraResponse;
