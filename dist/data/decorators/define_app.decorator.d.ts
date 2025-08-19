import { App } from "../common/app";
import { ControllerContract } from "../../domain/contracts/controller.contract";
import { ClassConstructor } from "../types/class_constructor.type";
export declare function DefineApp<T>(data: {
    port: (instance: T) => number;
    controllers?: ClassConstructor<ControllerContract>[];
}): <T_1 extends ClassConstructor<App>>(constructor: T_1) => {
    new (...args: any[]): {};
} & T_1;
