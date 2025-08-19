import { ControllerContract } from "../../domain/contracts/controller.contract";
import { RouteContract } from "../../domain/contracts/route.contract";
import { ClassConstructor } from "../types/class_constructor.type";
export declare function DefineController(data: {
    routes: ClassConstructor<RouteContract>[];
}): <T extends ClassConstructor<ControllerContract>>(constructor: T) => {
    new (...args: any[]): {};
} & T;
