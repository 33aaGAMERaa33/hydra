import { ControllerImplicitImpl } from "../../interfaces/controller_implicit.impl";
import { InjectableImplicitImpl } from "../../interfaces/injectable_implicit.impl";
import { MiddlewareImpl } from "../../interfaces/middleware.impl";
import { OriginalConstructorImplicitImpl } from "../../interfaces/original_constructor_implicit.impl";
import { CONTROLLER_METADATA_KEY } from "../../metadata_key/controller.metadata_key";
import { INJECT_METADATA_KEY } from "../../metadata_key/inject.metadata_key";
import { INJECTABLE_METADATA_KEY } from "../../metadata_key/injectable.metadata_key";
import { MIDDLEWARE_METADATA_KEY } from "../../metadata_key/middleware.metadata_key";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../../metadata_key/original_constructor.metadata_key";
import { ClassConstructor } from "../../types/class_constructor.type";
import { PendingInjects } from "../../types/pending_injects.type";

export class AppConfigHelper {
    private constructor() {

    }

    static instantiateControllers<T extends ClassConstructor>(controllersConstructor: T[]) {
        const controllersInstance: ControllerImplicitImpl[] = [];

        // Intera sobre os construtores fornecidos, validando se são mesmo controladores e em seguida adicionando em controllersInstance
        for(const controllerConstructor of controllersConstructor) {
            // Verifica se a classe tem metadados de controlador
            // Se não tiver gera um erro
            if(!Reflect.getMetadata(CONTROLLER_METADATA_KEY, controllerConstructor)) 
                throw new Error(`A classe ${controllerConstructor.name} não tem metadados de controlador`);
            // Instancia o controlador
            const controllerInstance: ControllerImplicitImpl = new controllerConstructor() as ControllerImplicitImpl;
            // Procura uma rota nos controladores já registrados e no atual
            // Se existir uma rota duplicada um erro é gerado
            for(const otherController of controllersInstance) {
                // Verifica se o controlador foi duplicado, se estiver duplicado gera um erro
                if(controllerInstance.__constructor === otherController.__constructor) 
                    throw new Error(`O controlador ${controllerInstance.__constructor.name} foi registrado mais de uma vez`);

                // Verifica se a rota está duplicada entre o controlador atual e o controlador que foi interado
                for(const route of controllerInstance.__routes) {
                    for(const otherRoute of otherController.__routes) {
                        // Verifica se as rotas são iguais, se forem um erro é gerado
                        if(route.equals(otherRoute)) {
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

    static instantiateInjectables<T extends ClassConstructor>(injectablesConstructor: T[]) {
        const injectablesInstace: InjectableImplicitImpl[] = [];

        // Intera sobre os construtores, validando se são injetaveis, e em seguida adicionando a lista
        for(const injectableConstructor of injectablesConstructor) {
            // Pega o construtor original
            const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, injectableConstructor) ?? injectableConstructor;
            // Verifica se a classe é injetavel, se não for gera um erro
            if(!Reflect.getMetadata(INJECTABLE_METADATA_KEY, injectableConstructor)) 
                throw new Error(`A classe ${originalConstructor.name} não tem metadados de injetavel`);

            // Instancia a classe e adiciona ela na lista
            injectablesInstace.push(new injectableConstructor() as InjectableImplicitImpl);
        }

        return injectablesInstace;
    }

    static instantiateMiddlewares<T extends MiddlewareImpl>(middlewaresConstructor: ClassConstructor<T>[]) {
        const middlewaresInstance: MiddlewareImpl[] = [];

        // Intera sobre os middlewares para validar se são mesmo middlewares e instancialos
        for(const middleware of middlewaresConstructor) {
            if(!Reflect.getMetadata(MIDDLEWARE_METADATA_KEY, middleware)) 
                throw new Error(`A classe ${middleware.name} não tem metadados de middleware`);

            middlewaresInstance.push(new middleware());
        }

        return middlewaresInstance;
    }

    static resolveDependences<T extends OriginalConstructorImplicitImpl>(instances: T[], injectables: InjectableImplicitImpl[], data?: {
        passAlreadyResolved: boolean;
        ignoreNotResolved: boolean;
    }) {
        // Intera sobre as instancias fornecidas para resolver as dependencias
        for(const instance of instances) {
            // Pega as injeções pendentes
            const pendingInjects: PendingInjects = Reflect.getMetadata(INJECT_METADATA_KEY, instance.__constructor) ?? {};

            // Intera sobre as injeções pendentes para resolver as dependencias
            for(const propertyKey in pendingInjects) {
                let resolved = false;
                // Pega a injeção pendente referente a propriedade
                const pendingInject = pendingInjects[propertyKey];
                const originalConstructor: ClassConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, pendingInject);
                // Intera sobre as injeções disponiveis
                for(const injectable of injectables) {
                    // Verifica se a injeção atual é igual a injeção pendente
                    // Se não for pula ela
                    if(injectable.__constructor !== originalConstructor) continue;
                    // Verifica se a injeção já foi resolvida, e se é para ignorar ela
                    // Se já foi e não for para ignorar gera um erro
                    if((instance as any)[propertyKey] !== undefined && !data?.passAlreadyResolved) 
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
                if(!resolved && !data?.ignoreNotResolved) 
                    throw new Error(`Não foi possivel resolver a injeção ${originalConstructor.name} em ${instance.__constructor.name}`);
            }
        }
    }
}