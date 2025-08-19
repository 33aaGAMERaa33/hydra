"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = Method;
const route_definition_1 = require("../definitions/route.definition");
const method_metadata_1 = require("../metadata/method.metadata");
const handler_parameters_metadata_1 = require("../metadata/handler_parameters.metadata");
const use_middleware_metadata_1 = require("../metadata/use_middleware.metadata");
function Method(method, path = "") {
    return function (target, propertyKey, descriptor) {
        // Pega os argumentos que o metodo precisa
        const handlerArgs = Reflect.getMetadata(handler_parameters_metadata_1.HANDLER_PARAMETERS_METADATA, target.constructor, propertyKey) ?? {};
        // Pega os middlewares para adicionar na instancia
        // Isso é para facilitar na hora de implementar eles
        const middlewares = Reflect.getMetadata(use_middleware_metadata_1.USE_MIDDLEWARE_METADATA, target.constructor, propertyKey) ?? [];
        // Instancia a rota
        // Essa rota é instanciada antes da classe existir e da instancia dela ser criada
        // Então o handler deve ser ligado a instancia da classe após ser instanciada
        // Isso deve ser feito no decorador @Controller
        // Os middlewares não são adicionados agora, eles são adicionados pelo @AppConfig
        const routeDefinition = new route_definition_1.RouteDefinition({
            method: method,
            handlerArgs: handlerArgs,
            handler: descriptor.value,
            path: path.startsWith("/") ? path : `/${path}`,
            beforeHandlerMiddlewares: [],
            afterHandlerMiddlewares: [],
        });
        // Guarda os middlewares na definição da rota
        Reflect.defineMetadata(use_middleware_metadata_1.USE_MIDDLEWARE_METADATA, middlewares, routeDefinition);
        // Guarda a rota 
        Reflect.defineMetadata(method_metadata_1.METHOD_METADATA, routeDefinition, target.constructor, propertyKey);
    };
}
