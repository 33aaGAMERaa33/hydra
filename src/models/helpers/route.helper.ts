import { HydraRequest } from "../../common/hydra_request";
import { HydraResponse } from "../../common/hydra_response";
import { ROUTE_HANDLER_PARAMETERS_METADATA_KEY } from "../../metadata_key/route_handler_parameters.metadata_key";
import { RouteHandlerParameter } from "../../types/route_handler_parameter.enum";
import { RouteHandlerParameters } from "../../types/route_handler_parameters.type";
import { ClassConstructor } from "../../types/class_constructor.type";
import { Context } from "../../common/context";
import { Route } from "../../common/route";

export class RouteHelper {
    private constructor() {}

    static buildArgs(
        context: Context,
        req: HydraRequest,
        res: HydraResponse,
        constructor: ClassConstructor,
        propertyKey: string | symbol,
    ): any[] {
        const args: any[] = [];

        // Recupera os metadados de parâmetros do método handler
        const parameters: RouteHandlerParameters = Reflect.getMetadata(ROUTE_HANDLER_PARAMETERS_METADATA_KEY, constructor, propertyKey) ?? {};

        // Para cada tipo de parâmetro decorado (body, headers, etc)
        for (const [key, index] of Object.entries(parameters)) {
            const param = key as RouteHandlerParameter;

            switch (param) {
                case RouteHandlerParameter.body:
                    args[index] = req.body;
                    break;
                case RouteHandlerParameter.query:
                    args[index] = req.query;
                    break;
                case RouteHandlerParameter.headers:
                    args[index] = req.headers;
                    break;
                case RouteHandlerParameter.req:
                    args[index] = req;
                    break;
                case RouteHandlerParameter.res:
                    args[index] = res;
                    break;
                case RouteHandlerParameter.context:
                    args[index] = context;
                    break;
                default:
                    throw new Error(`Parâmetro de rota não suportado: ${param}`);
            }
        }

        return args;
    }
}