"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseMiddleware = UseMiddleware;
const original_constructor_metadata_key_1 = require("../metadata_key/original_constructor.metadata_key");
const use_middleware_metadata_key_1 = require("../metadata_key/use_middleware.metadata_key");
function UseMiddleware(middleware) {
    return function (target, propertyKey, _) {
        // Pega os middlewares que já foram registrados
        const middlewares = Reflect.getMetadata(use_middleware_metadata_key_1.USE_MIDDLEWARE_METADATA_KEY, target.constructor, propertyKey) ?? [];
        const middlewareOriginalConstructor = Reflect.getMetadata(original_constructor_metadata_key_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, middleware) ?? middleware;
        // Verifica se o middleware atual já foi registrado
        // Se foi retorna para ignorar o resto do codigo
        if (middlewares.includes(middlewareOriginalConstructor))
            return;
        // Adiciona o middleware na lista
        middlewares.push(middlewareOriginalConstructor);
        // Guarda os middlewares
        Reflect.defineMetadata(use_middleware_metadata_key_1.USE_MIDDLEWARE_METADATA_KEY, middlewares, target.constructor, propertyKey);
    };
}
