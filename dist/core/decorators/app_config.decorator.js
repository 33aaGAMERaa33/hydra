"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = AppConfig;
const route_manager_1 = require("../../common/route_manager");
const app_config_helper_1 = require("../../helpers/app_config.helper");
const app_definition_1 = require("../definitions/app.definition");
const app_config_metadata_1 = require("../metadata/app_config.metadata");
const original_constructor_metadata_1 = require("../metadata/original_constructor.metadata");
function AppConfig(data) {
    return function (constructor) {
        // Pega o construtor original da classe
        const originalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, constructor) ?? constructor;
        const [controllersConstructor, injectablesConstructor, middlewaresConstructor,] = [
            data.controllers ?? [],
            data.injectables ?? [],
            data.middlewares ?? [],
        ];
        // Instancia as classes fornecidas
        const injectablesDefinition = app_config_helper_1.AppConfigHelper.instantiateInjectables(injectablesConstructor);
        const middlewaresDefinition = app_config_helper_1.AppConfigHelper.instantiateMiddlewares(middlewaresConstructor);
        const controllersDefinition = app_config_helper_1.AppConfigHelper.instantiateControllers(controllersConstructor, middlewaresDefinition);
        // Configuração para resolução de dependencias
        const config = {
            ignoreNotResolved: false,
            passAlreadyResolved: true,
        };
        // Resolve as dependencias das instancias
        for (const definition of [
            ...injectablesDefinition,
            ...middlewaresDefinition,
            ...controllersDefinition,
        ]) {
            app_config_helper_1.AppConfigHelper.resolveDependences(definition, injectablesDefinition, config);
        }
        // Define um novo construtor para substituir o construtor original
        const newConstructor = class extends constructor {
            constructor(...args) {
                super(...args);
                // Instancia a definição da aplicação
                const appDefinition = new app_definition_1.AppDefinition({
                    instance: this,
                    port: data.port(this),
                    controllers: controllersDefinition,
                    injectables: injectablesDefinition,
                    routeManager: data.routeManager ?? new route_manager_1.RouteManager(),
                });
                // Guarda a definição da aplicação em metadados na instancia
                Reflect.defineMetadata(app_config_metadata_1.APP_METADATA, appDefinition, this);
            }
        };
        // Guarda o construtor original em metadados
        Reflect.defineMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, originalConstructor, newConstructor);
        // Define no construtor que a classe é um app
        Reflect.defineMetadata(app_config_metadata_1.APP_METADATA, true, newConstructor);
        // Retorna o novo construtor
        return newConstructor;
    };
}
