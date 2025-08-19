import { Route } from "../common/route";
import { ClassConstructor } from "../types/class_constructor.type";
export declare function Controller(): <T extends ClassConstructor>(constructor: T) => {
    new (...args: any[]): {
        readonly __routes: Route[];
        readonly __constructor: ClassConstructor<any>;
    };
} & T;
