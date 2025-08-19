import { ControllerContract } from "../../domain/contracts/controller.contract";
import { ControllerDefinition } from "../definitions/controller.definition";
import { ClassConstructor } from "../types/class_constructor.type";
export declare class DefineAppHelper {
    private constructor();
    static instantiateControllers<T extends ClassConstructor<ControllerContract>>(controllers: T[]): ControllerDefinition[];
}
