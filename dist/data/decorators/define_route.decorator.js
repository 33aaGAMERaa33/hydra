"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefineRoute = DefineRoute;
const route_definition_1 = require("../definitions/route.definition");
const handler_parameters_metadata_1 = require("../metadatas/handler_parameters.metadata");
const original_constructor_metadata_1 = require("../metadatas/original_constructor.metadata");
const route_metadata_1 = require("../metadatas/route.metadata");
// Decorador para declarar rotas
function DefineRoute(data) {
    return function (constructor) {
        // Recupera dados guardados nos metadados
        const originalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, constructor) ?? constructor;
        const handlerParameters = Reflect.getMetadata(handler_parameters_metadata_1.HANDLER_PARAMETERS, constructor) ?? {};
        // Cria um novo construtor para a classe
        // Isso é feito para adicionar logica no instanciamento da classe
        const newConstructor = class extends constructor {
            constructor(...args) {
                super(...args);
                // Instancia uma definição de rota com a instancia atual
                const routeDefinition = new route_definition_1.RouteDefinition({
                    route: this,
                    method: data.method,
                    parameters: handlerParameters,
                    path: data.path ? data.path.trim() : "",
                });
                // Guarda a definição da rota em metadados na instancia
                Reflect.defineMetadata(route_metadata_1.ROUTE_METADATA, routeDefinition, this);
            }
        };
        // Guarda o construtor original para comparações futuras
        Reflect.defineMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, originalConstructor, newConstructor);
        // Define que a classe é uma rota
        Reflect.defineMetadata(route_metadata_1.ROUTE_METADATA, true, newConstructor);
        return newConstructor;
    };
}
