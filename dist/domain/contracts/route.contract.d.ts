import { ControllerContract } from "./controller.contract";
export declare abstract class RouteContract<T extends ControllerContract = any> {
    private readonly controller;
    getController(): T;
    abstract handler(...args: any[]): any;
}
