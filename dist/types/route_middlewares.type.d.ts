import { MiddlewareImpl } from "../interfaces/middleware.impl";
import { ClassConstructor } from "./class_constructor.type";
export type RouteMiddlewares = ClassConstructor<MiddlewareImpl>[];
