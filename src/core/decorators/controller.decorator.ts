import { MiddlewareImpl } from "../../interfaces/middleware.impl";
import { ControllerDefinition } from "../definitions/controller.definition";
import { RouteDefinition } from "../definitions/route.definition";
import { CONTROLLER_METADATA } from "../metadata/controller.metadata";
import { HANDLER_PARAMETERS_METADATA } from "../metadata/handler_parameters.metadata";
import { METHOD_METADATA } from "../metadata/method.metadata";
import { ORIGINAL_CONSTRUCTOR_METADATA } from "../metadata/original_constructor.metadata";
import { USE_MIDDLEWARE_METADATA } from "../metadata/use_middleware.metadata";
import { ClassConstructor } from "../types/class_constructor.type";

export function Controller() {
    return function<T extends ClassConstructor>(constructor: T) {
        // Pega o construtor original
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA, constructor) ?? constructor

        // Cria um novo construtor para substituir o atual
        const newConstructor = class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                
                const routesDefinition: RouteDefinition[] = [];

                // Intera sobre os metodos da classe para procurar as rotas
                for(const [propertyKey, _] of Object.entries(Object.getOwnPropertyDescriptors(constructor.prototype))) {
                    // Tenta pegar o valor padrão da rota
                    const routeDefinition: RouteDefinition | undefined = Reflect.getMetadata(METHOD_METADATA, constructor, propertyKey);
                    // Verifica se esse valor existe
                    // Esse valor só existe se o metodo for decorado com @Method
                    if(routeDefinition === undefined) continue;

                    // Verifica se a rota está repitida
                    // Se estiver gera um erro
                    for(const otherRoute of routesDefinition) {
                        if(routeDefinition.equals(otherRoute)) 
                            throw new Error(`A rota ${routeDefinition.getPath()} via ${routeDefinition.getMethod()} está duplicada no controlador ${originalConstructor.name}`);
                    }

                    // Pega os middlewares para adicionar na nova definição
                    const middlewares: ClassConstructor<MiddlewareImpl>[] = Reflect.getMetadata(USE_MIDDLEWARE_METADATA, routeDefinition) ?? [];

                    // Instancia uma nova rota com os mesmos atributos da antiga, porem com o handler linkado com a instancia
                    const newDefinition = routeDefinition.cloneWith({
                        handler: routeDefinition.bindHandler(this),
                    });

                    // Guarda os middlewares na nova definição
                    Reflect.defineMetadata(USE_MIDDLEWARE_METADATA, middlewares, newDefinition);

                    // Adiciona a nova definição na lista
                    routesDefinition.push(newDefinition);

                    // Limpa os metadados do metodo agora que não vai precisar mais
                    Reflect.deleteMetadata(METHOD_METADATA, constructor, propertyKey);
                    Reflect.deleteMetadata(USE_MIDDLEWARE_METADATA, constructor, propertyKey);
                    Reflect.deleteMetadata(HANDLER_PARAMETERS_METADATA, constructor, propertyKey);
                }

                // Instancia a definição do controlador e guarda em metadados na instancia
                // Os middlewares não são adicionados agora pois só vão estar disponiveis depois
                const controllerDefinition = new ControllerDefinition<T>({
                    instance: this as any,
                    routesDefinition: routesDefinition,
                });

                // Guarda a definição do controlador em metadados na instancia
                Reflect.defineMetadata(CONTROLLER_METADATA, controllerDefinition, this);
                // Limpa a definição da rota guardada no metodo
            }
        }

        // Guarda o construtor original
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA, originalConstructor, newConstructor);
        // Define que a classe é um controlador no construtor
        Reflect.defineMetadata(CONTROLLER_METADATA, true, newConstructor);
        // Substitui o construtor atual
        return newConstructor;
    }
}