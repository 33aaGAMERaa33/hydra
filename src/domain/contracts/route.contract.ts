import { ControllerContract } from "./controller.contract";

export abstract class RouteContract<T extends ControllerContract = any> {
    private readonly controller!: T;

    getController(): T {
        return this.controller;
    }

    abstract handler(...args: any[]): any;
}