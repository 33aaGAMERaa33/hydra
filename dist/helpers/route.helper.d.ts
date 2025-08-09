import { Context } from "vm";
import { HydraRequest } from "../common/hydra_request";
import { HydraResponse } from "../common/hydra_response";
import { ClassConstructor } from "../core/types/class_constructor.type";
export declare class RouteHelper {
    private constructor();
    static buildArgs(context: Context, req: HydraRequest, res: HydraResponse, constructor: ClassConstructor, propertyKey: string | symbol): any[];
}
