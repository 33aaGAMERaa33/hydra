import { Equals } from "../interfaces/equals.impl";
import { HttpMethod } from "../types/http_method.enum";

export class Route implements Equals<Route> {
    readonly path: string;
    readonly httpMethod: HttpMethod;
    readonly propertyKey: string | symbol;
    readonly handler: (...args: any[]) => any;

    constructor(data: {
        path: string;
        httpMethod: HttpMethod,
        propertyKey: string | symbol,
        handler: (...args: any[]) => any,
    }) {
        this.path = data.path;
        this.handler = data.handler;
        this.httpMethod = data.httpMethod;
        this.propertyKey = data.propertyKey;
    }

    cloneWith(data?: {
        path?: string;
        httpMethod?: HttpMethod,
        propertyKey?: string | symbol,
        handler?: (...args: any[]) => any,
    }): Route {
        return new Route({
            path: data?.path ?? this.path,
            handler: data?.handler ??  this.handler,
            httpMethod: data?.httpMethod ?? this.httpMethod,
            propertyKey: data?.propertyKey ?? this.propertyKey,
        });
    }

    equals(other: Route): boolean {
        return this.path === other.path && this.httpMethod === other.httpMethod;
    }

    forThis(path: string, httpMehod: HttpMethod) {
        return this.path === path && this.httpMethod === httpMehod;
    }
}