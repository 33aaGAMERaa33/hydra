import { Context } from "../common/context";
import { HandlerParameters } from "../types/handler_parameters.type";
export declare class HandlerHelper {
    private constructor();
    static buildParameters: (context: Context) => HandlerParameters;
}
