"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
class Route {
    path;
    httpMethod;
    propertyKey;
    handler;
    constructor(data) {
        this.path = data.path;
        this.handler = data.handler;
        this.httpMethod = data.httpMethod;
        this.propertyKey = data.propertyKey;
    }
    cloneWith(data) {
        return new Route({
            path: data?.path ?? this.path,
            handler: data?.handler ?? this.handler,
            httpMethod: data?.httpMethod ?? this.httpMethod,
            propertyKey: data?.propertyKey ?? this.propertyKey,
        });
    }
    equals(other) {
        return this.path === other.path && this.httpMethod === other.httpMethod;
    }
    forThis(path, httpMehod) {
        return this.path === path && this.httpMethod === httpMehod;
    }
}
exports.Route = Route;
