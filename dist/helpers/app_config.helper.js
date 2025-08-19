"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigHelper = void 0;
const controller_metadata_1 = require("../core/metadata/controller.metadata");
const inject_metadata_1 = require("../core/metadata/inject.metadata");
const injectable_metadata_1 = require("../core/metadata/injectable.metadata");
const middleware_metadata_1 = require("../core/metadata/middleware.metadata");
const original_constructor_metadata_1 = require("../core/metadata/original_constructor.metadata");
const use_middleware_metadata_1 = require("../core/metadata/use_middleware.metadata");
const middleware_type_enum_1 = require("../core/types/middleware_type.enum");
class AppConfigHelper {
    constructor() {
    }
    // Metodo para instanciar os controladores e retornar apenas as definições
    static instantiateControllers(controllersConstructor, middlewaresDefinition) {
        const controllersDefinition = [];
        // Intera sobre os construtores fornecidos, validando se são mesmo controladores e em seguida adicionando em controllersInstance
        for (const controllerConstructor of controllersConstructor) {
            // Verifica se a classe tem metadados de controlador
            // Se não tiver gera um erro
            if (!Reflect.getMetadata(controller_metadata_1.CONTROLLER_METADATA, controllerConstructor))
                throw new Error(`A classe ${controllerConstructor.name} não tem metadados de controlador`);
            // Instancia a classe do controlador
            const controllerInstance = new controllerConstructor();
            // Pega a definição do controlador que é guardada dentro da instancia da classe do controlador
            const controllerDefinition = Reflect.getMetadata(controller_metadata_1.CONTROLLER_METADATA, controllerInstance);
            // Adiciona os middlewares às rotas
            for (const routeDefinition of controllerDefinition.routesDefinition) {
                const middlewaresConstructor = Reflect.getMetadata(use_middleware_metadata_1.USE_MIDDLEWARE_METADATA, routeDefinition) ?? [];
                // Intera sobre os middlewares para adicionar à rota
                for (const middlewareConstructor of middlewaresConstructor) {
                    let resolved = false;
                    const middlewareOriginalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, middlewareConstructor) ?? middlewareConstructor;
                    // Intera sobre os middlewares disponiveis para adicionar à rota
                    for (const middlewareDefinition of middlewaresDefinition) {
                        const instanceConstructor = Object.getPrototypeOf(middlewareDefinition.instance).constructor;
                        const instanceOriginalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, instanceConstructor) ?? instanceConstructor;
                        // Verifica se os construtores não coincidem
                        // Se não coincidirem pula
                        if (middlewareOriginalConstructor !== instanceOriginalConstructor)
                            continue;
                        // Marca como resolvido
                        resolved = true;
                        // Verifica em qual das listas deve por esse middleware
                        if (middlewareDefinition.instance.getType() === middleware_type_enum_1.MiddlewareType.beforeRouteHandler) {
                            routeDefinition.beforeHandlerMiddlewares.push(middlewareDefinition);
                        }
                        else {
                            routeDefinition.afterHandlerMiddlewares.push(middlewareDefinition);
                        }
                        // Quebra para continuar a execução do proximo middleware
                        break;
                    }
                    // Verifica se o middleware foi adicionado à rota
                    // Se nao foi gera um erro
                    if (!resolved)
                        throw new Error(`O middleware ${middlewareOriginalConstructor.name} não foi encontrado para uso`);
                }
            }
            // Adiciona na lista dos controladores
            controllersDefinition.push(controllerDefinition);
        }
        return controllersDefinition;
    }
    // Metodo para instanciar os injetaveis e retornar apenas suas definições
    static instantiateInjectables(injectablesConstructor) {
        const injectablesDefinition = [];
        // Intera sobre os construtores, instanciando e adicionando as definições à lista de definições
        for (const injectableConstructor of injectablesConstructor) {
            // Pega o construtor original se houver um
            const originalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, injectableConstructor);
            // Verifica se a classe é injetavel
            // Se não for gera um erro
            if (!Reflect.getMetadata(injectable_metadata_1.INJECTABLE_METADATA, injectableConstructor))
                throw new Error(`A classe ${(originalConstructor ?? injectableConstructor).name} não tem metadados de injetavel`);
            // Instancia a classe para que a definição seja gerada
            const injectableInstance = new injectableConstructor();
            // Pega a definição da injeção
            const injectableDefinition = Reflect.getMetadata(injectable_metadata_1.INJECTABLE_METADATA, injectableInstance);
            // Adiciona na lista
            injectablesDefinition.push(injectableDefinition);
        }
        return injectablesDefinition;
    }
    // Metodo para instanciar os middlewares e retornar apenas as definições deles
    static instantiateMiddlewares(middlewaresConstructor) {
        const middlewaresDefinition = [];
        // Intera sobre os construtores, instanciando e adicionando suas definições na lista
        for (const middlewareConstructor of middlewaresConstructor) {
            // Pega o construtor original
            const originalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, middlewareConstructor) ?? middlewareConstructor;
            // Verifica se a classe é realmente um middleware
            if (!Reflect.getMetadata(middleware_metadata_1.MIDDLEWARE_METADATA, middlewareConstructor))
                throw new Error(`A classe ${originalConstructor.name} não tem metadados de middleware`);
            // Instancia a classe, pega a definição e adiciona na lista
            const instance = new middlewareConstructor();
            const definition = Reflect.getMetadata(middleware_metadata_1.MIDDLEWARE_METADATA, instance);
            middlewaresDefinition.push(definition);
        }
        return middlewaresDefinition;
    }
    // Metodo para resolver as dependencias da instancia
    static resolveDependences(definition, injectables, data) {
        // Pega as injeções pendentes 
        const pendingInjects = Reflect.getMetadata(inject_metadata_1.INJECT_METADATA, Object.getPrototypeOf(definition.instance).constructor) ?? {};
        // Pega o construtor original da classe
        const originalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, Object.getPrototypeOf(definition.instance).constructor);
        // Intera sobre as pendencias para resolver as dependencias
        for (const propertyKey in pendingInjects) {
            // Verifica se a injeção atual é realmente injetavel
            const inject = pendingInjects[propertyKey];
            let resolved = false;
            if (!Reflect.getMetadata(injectable_metadata_1.INJECTABLE_METADATA, inject))
                throw Error(`Não é possivel resolver a injeção da propriedade ${propertyKey} da classe ${originalConstructor.name} pois o tipo não é injetável`);
            // Pega o construtor original da injeção pendente para comparar com a original do injetavel
            const injectOriginalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, inject);
            for (const injectable of injectables) {
                // Pega o construtor original do injetavel para comparar com a injeção pendente
                const injectableOriginalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, Object.getPrototypeOf(injectable.instance).constructor);
                // Verifica se ambos os construtores são diferentes
                // Se forem pula o injetavel
                if (injectableOriginalConstructor !== injectOriginalConstructor)
                    continue;
                // Injeta o valor na instancia 
                Object.defineProperty(definition.instance, propertyKey, {
                    value: injectable.instance,
                    writable: false,
                });
                // Define que a injeção foi resolvida
                resolved = true;
                break;
            }
            // Verifica não se foi resolvido e se é para ignorar
            // Se não for gera um erro
            if (!resolved && !data.ignoreNotResolved)
                throw new Error(`Não foi possivel resolver a dependencia de ${injectOriginalConstructor.name} em ${originalConstructor.name}`);
        }
    }
}
exports.AppConfigHelper = AppConfigHelper;
