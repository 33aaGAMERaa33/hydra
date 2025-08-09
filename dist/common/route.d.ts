import { Equals } from "../interfaces/equals.impl";
import { HttpMethod } from "../core/types/http_method.enum";
export declare class Route implements Equals<Route> {
    readonly path: string;
    readonly httpMethod: HttpMethod;
    readonly propertyKey: string | symbol;
    readonly handler: (...args: any[]) => any;
    constructor(data: {
        path: string;
        httpMethod: HttpMethod;
        propertyKey: string | symbol;
        handler: (...args: any[]) => any;
    });
    cloneWith(data?: {
        path?: string;
        httpMethod?: HttpMethod;
        propertyKey?: string | symbol;
        handler?: (...args: any[]) => any;
    }): Route;
    equals(other: Route): boolean;
    forThis(path: string, httpMehod: HttpMethod): boolean;
}
