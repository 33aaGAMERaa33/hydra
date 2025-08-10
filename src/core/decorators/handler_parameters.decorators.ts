import { HANDLER_PARAMETERS } from "../metadatas/handler_parameters.metadata";
import { HandlerParameter } from "../types/handler_parameter.enum";
import { HandlerParameters } from "../types/handler_parameters.type";

// Função para criar um decorador que define um parametro que um handler vai usar
function create(param: HandlerParameter): ParameterDecorator {
    return function(target, _, parameterIndex) {
        // Recupera os parametros já registrados
        const parameters: HandlerParameters = Reflect.getMetadata(HANDLER_PARAMETERS, target.constructor) ?? {};
        // Adiciona o parametro atual
        parameters[param] = parameterIndex;

        // Guarda os parametros junto com o atual
        Reflect.defineMetadata(HANDLER_PARAMETERS, parameters, target.constructor);
    }
} 

export const CurrentContext = () => create(HandlerParameter.context);
export const Req = () => create(HandlerParameter.req);
export const Res = () => create(HandlerParameter.res);
export const Headers = () => create(HandlerParameter.headers);
export const Body = () => create(HandlerParameter.body);
export const Query = () => create(HandlerParameter.query);