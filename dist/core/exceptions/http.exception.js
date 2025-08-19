"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
class HttpException {
    status;
    error;
    message;
    constructor(status, message, error) {
        this.status = status;
        this.message = message;
        this.error = error;
    }
}
exports.HttpException = HttpException;
