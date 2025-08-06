"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigHelper = void 0;
const controller_metadata_key_1 = require("../../metadata_key/controller.metadata_key");
const inject_metadata_key_1 = require("../../metadata_key/inject.metadata_key");
const injectable_metadata_key_1 = require("../../metadata_key/injectable.metadata_key");
const middleware_metadata_key_1 = require("../../metadata_key/middleware.metadata_key");
const original_constructor_metadata_key_1 = require("../../metadata_key/original_constructor.metadata_key");
class AppConfigHelper {
    constructor() {
    }
    static instantiateControllers(controllersConstructor) {
        const controllersInstance = [];
        // Intera sobre os construtores fornecidos, validando se são mesmo controladores e em seguida adicionando em controllersInstance
        for (const controllerConstructor of controllersConstructor) {
            // Verifica se a classe tem metadados de controlador
            // Se não tiver gera um erro
            if (!Reflect.getMetadata(controller_metadata_key_1.CONTROLLER_METADATA_KEY, controllerConstructor))
                throw new Error(`A classe ${controllerConstructor.name} não tem metadados de controlador`);
            // Instancia o controlador
            const controllerInstance = new controllerConstructor();
            // Procura uma rota nos controladores já registrados e no atual
            // Se existir uma rota duplicada um erro é gerado
            for (const otherController of controllersInstance) {
                // Verifica se o controlador foi duplicado, se estiver duplicado gera um erro
                if (controllerInstance.__constructor === otherController.__constructor)
                    throw new Error(`O controlador ${controllerInstance.__constructor.name} foi registrado mais de uma vez`);
                // Verifica se a rota está duplicada entre o controlador atual e o controlador que foi interado
                for (const route of controllerInstance.__routes) {
                    for (const otherRoute of otherController.__routes) {
                        // Verifica se as rotas são iguais, se forem um erro é gerado
                        if (route.equals(otherRoute)) {
                            const p = route.path;
                            const hM = route.httpMethod;
                            const c1 = controllerInstance.__constructor.name;
                            const c2 = otherController.__constructor.name;
                            throw new Error(`A rota ${p} via ${hM} está duplicado em ${c1} e ${c2}`);
                        }
                    }
                }
            }
            // Se tudo deu certo o controlador é registrado na lista
            controllersInstance.push(controllerInstance);
        }
        return controllersInstance;
    }
    static instantiateInjectables(injectablesConstructor) {
        const injectablesInstace = [];
        // Intera sobre os construtores, validando se são injetaveis, e em seguida adicionando a lista
        for (const injectableConstructor of injectablesConstructor) {
            // Pega o construtor original
            const originalConstructor = Reflect.getMetadata(original_constructor_metadata_key_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, injectableConstructor) ?? injectableConstructor;
            // Verifica se a classe é injetavel, se não for gera um erro
            if (!Reflect.getMetadata(injectable_metadata_key_1.INJECTABLE_METADATA_KEY, injectableConstructor))
                throw new Error(`A classe ${originalConstructor.name} não tem metadados de injetavel`);
            // Instancia a classe e adiciona ela na lista
            injectablesInstace.push(new injectableConstructor());
        }
        return injectablesInstace;
    }
    static instantiateMiddlewares(middlewaresConstructor) {
        const middlewaresInstance = [];
        // Intera sobre os middlewares para validar se são mesmo middlewares e instancialos
        for (const middleware of middlewaresConstructor) {
            if (!Reflect.getMetadata(middleware_metadata_key_1.MIDDLEWARE_METADATA_KEY, middleware))
                throw new Error(`A classe ${middleware.name} não tem metadados de middleware`);
            middlewaresInstance.push(new middleware());
        }
        return middlewaresInstance;
    }
    static resolveDependences(instances, injectables, data) {
        // Intera sobre as instancias fornecidas para resolver as dependencias
        for (const instance of instances) {
            // Pega as injeções pendentes
            const pendingInjects = Reflect.getMetadata(inject_metadata_key_1.INJECT_METADATA_KEY, instance.__constructor) ?? {};
            // Intera sobre as injeções pendentes para resolver as dependencias
            for (const propertyKey in pendingInjects) {
                let resolved = false;
                // Pega a injeção pendente referente a propriedade
                const pendingInject = pendingInjects[propertyKey];
                const originalConstructor = Reflect.getMetadata(original_constructor_metadata_key_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, pendingInject);
                // Intera sobre as injeções disponiveis
                for (const injectable of injectables) {
                    // Verifica se a injeção atual é igual a injeção pendente
                    // Se não for pula ela
                    if (injectable.__constructor !== originalConstructor)
                        continue;
                    // Verifica se a injeção já foi resolvida, e se é para ignorar ela
                    // Se já foi e não for para ignorar gera um erro
                    if (instance[propertyKey] !== undefined && !data?.passAlreadyResolved)
                        throw new Error(`A injeção ${originalConstructor.name} já foi resolvida em ${instance.__constructor.name}`);
                    // Define que essa injeção foi resolvida
                    resolved = true;
                    // Define o valor da propriedade
                    Object.defineProperty(instance, propertyKey, {
                        value: injectable,
                        writable: false,
                    });
                }
                // Verifica se não foi resolvida, e se não foi se é para ignorar
                // Se não foi resolvida e não for para ignorar gera um erro
                if (!resolved && !data?.ignoreNotResolved)
                    throw new Error(`Não foi possivel resolver a injeção ${originalConstructor.name} em ${instance.__constructor.name}`);
            }
        }
    }
}
exports.AppConfigHelper = AppConfigHelper;
