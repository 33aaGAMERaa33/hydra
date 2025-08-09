"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = Controller;
const controller_definition_1 = require("../definitions/controller.definition");
const controller_metadata_1 = require("../metadata/controller.metadata");
const handler_parameters_metadata_1 = require("../metadata/handler_parameters.metadata");
const method_metadata_1 = require("../metadata/method.metadata");
const original_constructor_metadata_1 = require("../metadata/original_constructor.metadata");
const use_middleware_metadata_1 = require("../metadata/use_middleware.metadata");
function Controller() {
    return function (constructor) {
        // Pega o construtor original
        const originalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, constructor) ?? constructor;
        // Cria um novo construtor para substituir o atual
        const newConstructor = class extends constructor {
            constructor(...args) {
                super(...args);
                const routesDefinition = [];
                // Intera sobre os metodos da classe para procurar as rotas
                for (const [propertyKey, _] of Object.entries(Object.getOwnPropertyDescriptors(constructor.prototype))) {
                    // Tenta pegar o valor padrão da rota
                    const routeDefinition = Reflect.getMetadata(method_metadata_1.METHOD_METADATA, constructor, propertyKey);
                    // Verifica se esse valor existe
                    // Esse valor só existe se o metodo for decorado com @Method
                    if (routeDefinition === undefined)
                        continue;
                    // Verifica se a rota está repitida
                    // Se estiver gera um erro
                    for (const otherRoute of routesDefinition) {
                        if (routeDefinition.equals(otherRoute))
                            throw new Error(`A rota ${routeDefinition.getPath()} via ${routeDefinition.getMethod()} está duplicada no controlador ${originalConstructor.name}`);
                    }
                    // Pega os middlewares para adicionar na nova definição
                    const middlewares = Reflect.getMetadata(use_middleware_metadata_1.USE_MIDDLEWARE_METADATA, routeDefinition) ?? [];
                    // Instancia uma nova rota com os mesmos atributos da antiga, porem com o handler linkado com a instancia
                    const newDefinition = routeDefinition.cloneWith({
                        handler: routeDefinition.bindHandler(this),
                    });
                    // Guarda os middlewares na nova definição
                    Reflect.defineMetadata(use_middleware_metadata_1.USE_MIDDLEWARE_METADATA, middlewares, newDefinition);
                    // Adiciona a nova definição na lista
                    routesDefinition.push(newDefinition);
                    // Limpa os metadados do metodo agora que não vai precisar mais
                    Reflect.deleteMetadata(method_metadata_1.METHOD_METADATA, constructor, propertyKey);
                    Reflect.deleteMetadata(use_middleware_metadata_1.USE_MIDDLEWARE_METADATA, constructor, propertyKey);
                    Reflect.deleteMetadata(handler_parameters_metadata_1.HANDLER_PARAMETERS_METADATA, constructor, propertyKey);
                }
                // Instancia a definição do controlador e guarda em metadados na instancia
                // Os middlewares não são adicionados agora pois só vão estar disponiveis depois
                const controllerDefinition = new controller_definition_1.ControllerDefinition({
                    instance: this,
                    routesDefinition: routesDefinition,
                });
                // Guarda a definição do controlador em metadados na instancia
                Reflect.defineMetadata(controller_metadata_1.CONTROLLER_METADATA, controllerDefinition, this);
                // Limpa a definição da rota guardada no metodo
            }
        };
        // Guarda o construtor original
        Reflect.defineMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, originalConstructor, newConstructor);
        // Define que a classe é um controlador no construtor
        Reflect.defineMetadata(controller_metadata_1.CONTROLLER_METADATA, true, newConstructor);
        // Substitui o construtor atual
        return newConstructor;
    };
}
