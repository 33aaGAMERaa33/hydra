import { RouteDefinition } from "../definitions/route.definition";
import { METHOD_METADATA } from "../metadata/method.metadata";
import { HANDLER_PARAMETERS_METADATA } from "../metadata/handler_parameters.metadata";
import { RouteHandlerParameters } from "../types/route_handler_parameters.type";
import { USE_MIDDLEWARE_METADATA } from "../metadata/use_middleware.metadata";
import { HttpMethod } from "../types/http_method.enum";
import { Handler } from "../types/handler.type";

export function Method(method: HttpMethod, path: string = ""): MethodDecorator {
    return function(target, propertyKey, descriptor) {
        // Pega os argumentos que o metodo precisa
        const handlerArgs: RouteHandlerParameters = Reflect.getMetadata(HANDLER_PARAMETERS_METADATA, target.constructor, propertyKey) ?? {};
        // Pega os middlewares para adicionar na instancia
        // Isso é para facilitar na hora de implementar eles
        const middlewares = Reflect.getMetadata(USE_MIDDLEWARE_METADATA, target.constructor, propertyKey) ?? [];
        // Instancia a rota
        // Essa rota é instanciada antes da classe existir e da instancia dela ser criada
        // Então o handler deve ser ligado a instancia da classe após ser instanciada
        // Isso deve ser feito no decorador @Controller
        // Os middlewares não são adicionados agora, eles são adicionados pelo @AppConfig
        const routeDefinition = new RouteDefinition({
            method: method,
            handlerArgs: handlerArgs,
            handler: (descriptor.value! as Handler),
            path: path.startsWith("/") ? path : `/${path}`,
            beforeHandlerMiddlewares: [],
            afterHandlerMiddlewares: [],
        });

        // Guarda os middlewares na definição da rota
        Reflect.defineMetadata(USE_MIDDLEWARE_METADATA, middlewares, routeDefinition);
        // Guarda a rota 
        Reflect.defineMetadata(METHOD_METADATA, routeDefinition, target.constructor, propertyKey);
    }
}