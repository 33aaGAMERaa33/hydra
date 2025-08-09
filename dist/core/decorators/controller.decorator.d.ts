import { ClassConstructor } from "../types/class_constructor.type";
export declare function Controller(): <T extends ClassConstructor>(constructor: T) => {
    new (...args: any[]): {};
} & T;
