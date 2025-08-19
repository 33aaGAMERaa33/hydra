"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefineApp = DefineApp;
const app_definition_1 = require("../definitions/app.definition");
const define_app_helper_1 = require("../helpers/define_app.helper");
const app_metadata_1 = require("../metadatas/app.metadata");
const original_constructor_metadata_1 = require("../metadatas/original_constructor.metadata");
// Decorador para definir app
function DefineApp(data) {
    return function (constructor) {
        // Recupera o construtor original
        const originalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, constructor) ?? constructor;
        const [controllers,] = [
            data.controllers ?? [],
        ];
        // Instancia as classes e adquire suas definições
        const controllersDefine = define_app_helper_1.DefineAppHelper.instantiateControllers(controllers);
        // Cria um novo construtor para substituir o original
        // Esse construtor novo vai ter uma logica adicionada a ele para preparar a aplicação
        const newConstructor = class extends constructor {
            constructor(...args) {
                super(...args);
                // Cria a definição do app e guarda em metadados na instancia
                const definition = new app_definition_1.AppDefinition({
                    app: this,
                    port: data.port(this),
                    controllers: controllersDefine,
                });
                Reflect.defineMetadata(app_metadata_1.APP_METADATA, definition, this);
            }
        };
        // Guarda o construtor original
        Reflect.defineMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, originalConstructor, newConstructor);
        // Define que a classe é um app
        Reflect.defineMetadata(app_metadata_1.APP_METADATA, true, newConstructor);
        return newConstructor;
    };
}
