"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseMiddleware = UseMiddleware;
const use_middleware_metadata_1 = require("../metadata/use_middleware.metadata");
function UseMiddleware(middlewareConstructor) {
    return function (target, propertyKey, _) {
        // Pega os middlewares que vão ser usados
        const middlewares = Reflect.getMetadata(use_middleware_metadata_1.USE_MIDDLEWARE_METADATA, target.constructor, propertyKey) ?? [];
        // Se o middleware já foi adicionado ignora o restante do codigo
        if (middlewares.includes(middlewareConstructor))
            return;
        // Adiciona o construtor original do middleware na lista
        middlewares.push(middlewareConstructor);
        // Guarda os middlewares atualizados em metadados no metodo
        Reflect.defineMetadata(use_middleware_metadata_1.USE_MIDDLEWARE_METADATA, middlewares, target.constructor, propertyKey);
    };
}
