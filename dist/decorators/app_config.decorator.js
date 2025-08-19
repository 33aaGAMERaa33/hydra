"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = AppConfig;
const route_manager_1 = require("../common/route_manager");
const app_config_metadata_key_1 = require("../metadata_key/app_config.metadata_key");
const original_constructor_metadata_key_1 = require("../metadata_key/original_constructor.metadata_key");
const app_config_helper_1 = require("../models/helpers/app_config.helper");
function AppConfig(data) {
    return function (constructor) {
        // Pega o construtor original da classe
        const originalConstructor = Reflect.getMetadata(original_constructor_metadata_key_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
        const [controllersConstructor, injectablesConstructor, middlewaresConstructor,] = [
            data.controllers ?? [],
            data.injectables ?? [],
            data.middlewares ?? [],
        ];
        // Instancia as classes fornecidas
        const injectablesInstance = app_config_helper_1.AppConfigHelper.instantiateInjectables(injectablesConstructor);
        const controllersInstance = app_config_helper_1.AppConfigHelper.instantiateControllers(controllersConstructor);
        const middlewaresInstance = app_config_helper_1.AppConfigHelper.instantiateMiddlewares(middlewaresConstructor);
        // Define um novo construtor para substituir o construtor original
        const newConstructor = class extends constructor {
            __port;
            __constructor = originalConstructor;
            __middlewares = middlewaresInstance;
            __controllers = controllersInstance;
            __routeManager = data.routeManager ?? new route_manager_1.RouteManager();
            constructor(...args) {
                super(...args);
                // inicializa a propriedade que define a porta do servidor
                this.__port = data.port(this);
                const config = {
                    ignoreNotResolved: false,
                    passAlreadyResolved: true,
                };
                // Resolve as dependencias pendentes
                app_config_helper_1.AppConfigHelper.resolveDependences(injectablesInstance, injectablesInstance, config);
                app_config_helper_1.AppConfigHelper.resolveDependences(controllersInstance, injectablesInstance, config);
            }
        };
        // Guarda o construtor original em metadados
        Reflect.defineMetadata(original_constructor_metadata_key_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
        // Define no construtor que a classe é um app
        Reflect.defineMetadata(app_config_metadata_key_1.APP_CONFIG_METADATA_KEY, true, newConstructor);
        // Retorna o novo construtor
        return newConstructor;
    };
}
