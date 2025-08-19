import { MiddlewareImpl } from "../interfaces/middleware.impl";
import { ClassConstructor } from "../types/class_constructor.type";
import { MiddlewareType } from "../types/middleware_type.enum";
export declare function Middleware<T extends ClassConstructor<MiddlewareImpl>>(constructor: T): {
    new (...args: any[]): {
        __constructor: ClassConstructor<any>;
        getType(): MiddlewareType;
        handler(...args: any[]): any;
    };
} & T;
