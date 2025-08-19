"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = Middleware;
const middleware_metadata_1 = require("../metadata/middleware.metadata");
const original_constructor_metadata_1 = require("../metadata/original_constructor.metadata");
const handler_parameters_metadata_1 = require("../metadata/handler_parameters.metadata");
const middleware_definition_1 = require("../definitions/middleware.definition");
function Middleware(constructor) {
    // Pega o construtor original
    const originalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, constructor) ?? constructor;
    // Pega os argumentos que o handler precisa
    const handlerArgs = Reflect.getMetadata(handler_parameters_metadata_1.HANDLER_PARAMETERS_METADATA, constructor, "handler");
    // Cria um novo construtor para substituir o original
    const newConstructor = class extends constructor {
        constructor(...args) {
            super(...args);
            // Instancia a definição do middleware e guarda em metadados na instancia
            const middlewareDefinition = new middleware_definition_1.MiddlewareDefinition({
                instance: this,
                handlerArgs: handlerArgs,
                handler: this.handler.bind(this),
            });
            Reflect.defineMetadata(middleware_metadata_1.MIDDLEWARE_METADATA, middlewareDefinition, this);
        }
    };
    // Guarda o construtor original em metadados
    Reflect.defineMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, originalConstructor, newConstructor);
    // Define que a classe é um middleware
    Reflect.defineMetadata(middleware_metadata_1.MIDDLEWARE_METADATA, true, newConstructor);
    return newConstructor;
}
