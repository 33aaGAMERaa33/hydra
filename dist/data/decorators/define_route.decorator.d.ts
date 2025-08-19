import { RouteContract } from "../../domain/contracts/route.contract";
import { HttpMethod } from "../enums/http_method.enum";
import { ClassConstructor } from "../types/class_constructor.type";
export declare function DefineRoute(data: {
    path?: string;
    method: HttpMethod;
}): <T extends ClassConstructor<RouteContract>>(constructor: T) => T;
