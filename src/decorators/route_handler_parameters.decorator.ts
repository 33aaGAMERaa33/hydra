import { RouteHandlerParameter } from "../types/route_handler_parameter.enum";
import { RouteHandlerParameters } from "../types/route_handler_parameters.type";
import { ROUTE_HANDLER_PARAMETERS_METADATA_KEY } from "../metadata_key/route_handler_parameters.metadata_key";

// Metodo reutilizavel para criar decoradores para parametro de route handler
function createParameterDecorator(parameter: RouteHandlerParameter): ParameterDecorator {
    return function(target, propertyKey, parameterIndex) {
        // Pega os parametros de rota que já foram registrados 
        const parameters: RouteHandlerParameters = Reflect.getMetadata(ROUTE_HANDLER_PARAMETERS_METADATA_KEY, target.constructor, propertyKey!) ?? {};
        // Adiciona o parametro fornecido na lista
        parameters[parameter] = parameterIndex;

        // Guarda os parametros novamente
        Reflect.defineMetadata(ROUTE_HANDLER_PARAMETERS_METADATA_KEY, parameters, target.constructor, propertyKey!);
    }
}

export const Req = () => createParameterDecorator(RouteHandlerParameter.req);
export const Res = () => createParameterDecorator(RouteHandlerParameter.res);
export const Body = () => createParameterDecorator(RouteHandlerParameter.body);
export const Query = () => createParameterDecorator(RouteHandlerParameter.query);
export const Headers = () => createParameterDecorator(RouteHandlerParameter.headers);
export const GetContext = () => createParameterDecorator(RouteHandlerParameter.context);