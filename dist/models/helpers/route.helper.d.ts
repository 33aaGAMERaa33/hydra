import { HydraRequest } from "../../common/hydra_request";
import { HydraResponse } from "../../common/hydra_response";
import { ClassConstructor } from "../../types/class_constructor.type";
import { Context } from "../../common/context";
export declare class RouteHelper {
    private constructor();
    static buildArgs(context: Context, req: HydraRequest, res: HydraResponse, constructor: ClassConstructor, propertyKey: string | symbol): any[];
}
