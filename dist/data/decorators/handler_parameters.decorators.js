"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = exports.Body = exports.Headers = exports.Res = exports.Req = exports.CurrentContext = void 0;
const handler_parameters_metadata_1 = require("../metadatas/handler_parameters.metadata");
const handler_parameter_enum_1 = require("../types/handler_parameter.enum");
// Função para criar um decorador que define um parametro que um handler vai usar
function create(param) {
    return function (target, _, parameterIndex) {
        // Recupera os parametros já registrados
        const parameters = Reflect.getMetadata(handler_parameters_metadata_1.HANDLER_PARAMETERS, target.constructor) ?? {};
        // Adiciona o parametro atual
        parameters[param] = parameterIndex;
        // Guarda os parametros junto com o atual
        Reflect.defineMetadata(handler_parameters_metadata_1.HANDLER_PARAMETERS, parameters, target.constructor);
    };
}
const CurrentContext = () => create(handler_parameter_enum_1.HandlerParameter.context);
exports.CurrentContext = CurrentContext;
const Req = () => create(handler_parameter_enum_1.HandlerParameter.req);
exports.Req = Req;
const Res = () => create(handler_parameter_enum_1.HandlerParameter.res);
exports.Res = Res;
const Headers = () => create(handler_parameter_enum_1.HandlerParameter.headers);
exports.Headers = Headers;
const Body = () => create(handler_parameter_enum_1.HandlerParameter.body);
exports.Body = Body;
const Query = () => create(handler_parameter_enum_1.HandlerParameter.query);
exports.Query = Query;
