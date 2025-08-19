"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefineController = DefineController;
const controller_definition_1 = require("../definitions/controller.definition");
const controller_metadata_1 = require("../metadatas/controller.metadata");
const original_constructor_metadata_1 = require("../metadatas/original_constructor.metadata");
const route_metadata_1 = require("../metadatas/route.metadata");
// Decorador para definir um controlador
function DefineController(data) {
    return function (constructor) {
        // Recupera o construtor original guardado em metadados
        const originalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, constructor) ?? constructor;
        // Cria um novo construtor para a classe
        // Isso é feito para adicionar logica no instanciamento da classe
        const newConstructor = class extends constructor {
            constructor(...args) {
                super(...args);
                const routesDefinition = [];
                // Intera sobre os construtores para instanciar e pegar as definições das rotas
                for (const routeConstructor of data.routes) {
                    // Verifica se o construtor contem metadados de definição da rota
                    const isRoute = Reflect.getMetadata(route_metadata_1.ROUTE_METADATA, routeConstructor);
                    if (!isRoute)
                        throw new Error(`A classe ${routeConstructor.name} não contém metadados de rota`);
                    // Instancia a classe para obter a definição da rota
                    const instance = new routeConstructor();
                    const definition = Reflect.getMetadata(route_metadata_1.ROUTE_METADATA, instance);
                    // Verifica se o caminho da rota está duplicado
                    // Se estiver gera um erro
                    for (const otherDefinition of routesDefinition) {
                        // Pega o construtor original das rotas
                        const thisRouteOriginalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, Object.getPrototypeOf(definition.route).constructor);
                        const otherRouteOriginalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, Object.getPrototypeOf(otherDefinition.route).constructor);
                        const r1ConstructorName = thisRouteOriginalConstructor.name;
                        const r2ConstructorName = otherRouteOriginalConstructor.name;
                        // Verifica se ambas as rotas são do mesmo destino
                        // Se foram gera um erro
                        if (definition.equalsPath(otherDefinition))
                            throw new Error(`As rotas ${r1ConstructorName} & ${r2ConstructorName} estão duplicadas no controlador ${originalConstructor.name}`);
                    }
                    // Adiciona a definição na lista
                    routesDefinition.push(definition);
                    // Define a propriedade 'controller' da rota como a instancia do controlador
                    Object.defineProperty(instance, "controller", {
                        value: this,
                        writable: false,
                    });
                }
                // Cria a definição do controlador
                const definition = new controller_definition_1.ControllerDefinition({
                    controller: this,
                    routes: routesDefinition,
                });
                // Guarda a definição em metadados no construtor
                Reflect.defineMetadata(controller_metadata_1.CONTROLLER_METADATA, definition, this);
            }
        };
        // Guarda o construtor original para comparações futuras
        Reflect.defineMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, originalConstructor, newConstructor);
        // Define que a classe é uma rota
        Reflect.defineMetadata(controller_metadata_1.CONTROLLER_METADATA, true, newConstructor);
        return newConstructor;
    };
}
