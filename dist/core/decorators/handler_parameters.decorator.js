"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetContext = exports.Headers = exports.Query = exports.Body = exports.Res = exports.Req = void 0;
const route_handler_parameter_enum_1 = require("../types/route_handler_parameter.enum");
const handler_parameters_metadata_1 = require("../metadata/handler_parameters.metadata");
// Metodo reutilizavel para criar decoradores para parametro de route handler
function createParameterDecorator(parameter) {
    return function (target, propertyKey, parameterIndex) {
        // Pega os parametros de rota que já foram registrados 
        const parameters = Reflect.getMetadata(handler_parameters_metadata_1.HANDLER_PARAMETERS_METADATA, target.constructor, propertyKey) ?? {};
        // Adiciona o parametro fornecido na lista
        parameters[parameter] = parameterIndex;
        // Guarda os parametros novamente
        Reflect.defineMetadata(handler_parameters_metadata_1.HANDLER_PARAMETERS_METADATA, parameters, target.constructor, propertyKey);
    };
}
const Req = () => createParameterDecorator(route_handler_parameter_enum_1.RouteHandlerParameter.req);
exports.Req = Req;
const Res = () => createParameterDecorator(route_handler_parameter_enum_1.RouteHandlerParameter.res);
exports.Res = Res;
const Body = () => createParameterDecorator(route_handler_parameter_enum_1.RouteHandlerParameter.body);
exports.Body = Body;
const Query = () => createParameterDecorator(route_handler_parameter_enum_1.RouteHandlerParameter.query);
exports.Query = Query;
const Headers = () => createParameterDecorator(route_handler_parameter_enum_1.RouteHandlerParameter.headers);
exports.Headers = Headers;
const GetContext = () => createParameterDecorator(route_handler_parameter_enum_1.RouteHandlerParameter.context);
exports.GetContext = GetContext;
