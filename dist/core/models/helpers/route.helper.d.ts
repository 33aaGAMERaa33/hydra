import { ClassConstructor } from "../../types/class_constructor.type";
import { Context } from "vm";
import { HydraRequest } from "../../../common/hydra_request";
import { HydraResponse } from "../../../common/hydra_response";
export declare class RouteHelper {
    private constructor();
    static buildArgs(context: Context, req: HydraRequest, res: HydraResponse, constructor: ClassConstructor, propertyKey: string | symbol): any[];
}
