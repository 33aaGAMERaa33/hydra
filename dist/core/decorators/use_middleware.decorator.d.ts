import { MiddlewareImpl } from "../../interfaces/middleware.impl";
import { ClassConstructor } from "../types/class_constructor.type";
export declare function UseMiddleware<T extends ClassConstructor<MiddlewareImpl>>(middlewareConstructor: T): MethodDecorator;
