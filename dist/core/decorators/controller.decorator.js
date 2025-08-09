"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = Controller;
const controller_metadata_key_1 = require("../metadata_key/controller.metadata_key");
const method_metadata_key_1 = require("../metadata_key/method.metadata_key");
const original_constructor_metadata_key_1 = require("../metadata_key/original_constructor.metadata_key");
function Controller() {
    return function (constructor) {
        // Pega o construtor original
        const originalConstructor = Reflect.getMetadata(original_constructor_metadata_key_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
        // Cria um novo construtor para substituir o atual
        const newConstructor = class extends constructor {
            __routes = [];
            __constructor = originalConstructor;
            constructor(...args) {
                super(...args);
                // Intera sobre os metodos da classe para procurar as rotas
                for (const [_, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(constructor.prototype))) {
                    // Tenta pegar o valor padrão da rota
                    const route = Reflect.getMetadata(method_metadata_key_1.METHOD_METADATA_KEY, descriptor.value);
                    // Verifica se esse valor existe
                    // Esse valor só existe se o metodo for decorado com @Method
                    if (route === undefined)
                        continue;
                    // Verifica se a rota está repitida
                    // Se estiver gera um erro
                    for (const otherRoute of this.__routes) {
                        if (route.equals(otherRoute))
                            throw new Error(`A rota ${route.path} via ${route.httpMethod} está duplicada no controlador ${originalConstructor.name}`);
                    }
                    // Instancia uma nova rota com os mesmos atributos da antiga, porem com o handler linkado com a instancia
                    this.__routes.push(route.cloneWith({
                        handler: route.handler.bind(this),
                    }));
                }
            }
        };
        // Salva o construtor original
        Reflect.defineMetadata(original_constructor_metadata_key_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
        // Define que a classe é um controlador no construtor
        Reflect.defineMetadata(controller_metadata_key_1.CONTROLLER_METADATA_KEY, true, newConstructor);
        // Substitui o construtor atual
        return newConstructor;
    };
}
