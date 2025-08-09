import { Controller } from "../common/controller";

export interface RouteImpl<T extends Controller = any> {
    controller: T;
    handler(...args: any[]): any;
}