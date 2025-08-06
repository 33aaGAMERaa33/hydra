"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteHelper = void 0;
const route_handler_parameters_metadata_key_1 = require("../../metadata_key/route_handler_parameters.metadata_key");
const route_handler_parameter_enum_1 = require("../../types/route_handler_parameter.enum");
class RouteHelper {
    constructor() { }
    static buildArgs(context, req, res, constructor, propertyKey) {
        const args = [];
        // Recupera os metadados de parâmetros do método handler
        const parameters = Reflect.getMetadata(route_handler_parameters_metadata_key_1.ROUTE_HANDLER_PARAMETERS_METADATA_KEY, constructor, propertyKey) ?? {};
        // Para cada tipo de parâmetro decorado (body, headers, etc)
        for (const [key, index] of Object.entries(parameters)) {
            const param = key;
            switch (param) {
                case route_handler_parameter_enum_1.RouteHandlerParameter.body:
                    args[index] = req.body;
                    break;
                case route_handler_parameter_enum_1.RouteHandlerParameter.query:
                    args[index] = req.query;
                    break;
                case route_handler_parameter_enum_1.RouteHandlerParameter.headers:
                    args[index] = req.headers;
                    break;
                case route_handler_parameter_enum_1.RouteHandlerParameter.req:
                    args[index] = req;
                    break;
                case route_handler_parameter_enum_1.RouteHandlerParameter.res:
                    args[index] = res;
                    break;
                case route_handler_parameter_enum_1.RouteHandlerParameter.context:
                    args[index] = context;
                    break;
                default:
                    throw new Error(`Parâmetro de rota não suportado: ${param}`);
            }
        }
        return args;
    }
}
exports.RouteHelper = RouteHelper;
