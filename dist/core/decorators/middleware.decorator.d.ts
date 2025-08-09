import { MiddlewareImpl } from "../../interfaces/middleware.impl";
import { ClassConstructor } from "../types/class_constructor.type";
export declare function Middleware<T extends ClassConstructor<MiddlewareImpl>>(constructor: T): {
    new (...args: any[]): {
        getType(): import("../..").MiddlewareType;
        handler(...args: any[]): any;
    };
} & T;
