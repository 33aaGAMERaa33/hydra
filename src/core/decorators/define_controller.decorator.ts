import { Controller } from "../../common/controller";
import { RouteImpl } from "../../interfaces/route.impl";
import { ControllerDefinition } from "../definitions/controller.definition";
import { RouteDefinition } from "../definitions/route.definition";
import { CONTROLLER_METADATA } from "../metadatas/controller.metadata";
import { ORIGINAL_CONSTRUCTOR_METADATA } from "../metadatas/original_constructor.metadata";
import { ROUTE_METADATA } from "../metadatas/route.metadata";
import { ClassConstructor } from "../types/class_constructor.type";

// Decorador para definir um controlador
export function DefineController(data: {
    prefix: string,
    routes: ClassConstructor<RouteImpl>[],
}) {
    return function<T extends ClassConstructor<Controller>>(constructor: T) {        
        // Recupera o construtor original guardado em metadados
        const originalConstructor: ClassConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA, constructor) ?? constructor;

        // Cria um novo construtor para a classe
        // Isso é feito para adicionar logica no instanciamento da classe
        const newConstructor = class extends constructor {
            constructor(...args: any[]){
                super(...args);
                const routesDefinition: RouteDefinition[] = [];
                // Intera sobre os construtores para instanciar e pegar as definições das rotas
                for(const routeConstructor of data.routes) {
                    // Verifica se o construtor contem metadados de definição da rota
                    const isRoute: RouteDefinition | undefined = Reflect.getMetadata(ROUTE_METADATA, routeConstructor);

                    if(!isRoute) 
                        throw new Error(`A classe ${routeConstructor.name} não contém metadados de rota`);

                    // Instancia a classe para obter a definição da rota
                    const instance = new routeConstructor();
                    const definition: RouteDefinition = Reflect.getMetadata(ROUTE_METADATA, instance);

                    // Adiciona a definição na lista
                    routesDefinition.push(definition);
                }

                // Cria a definição do controlador
                const definition = new ControllerDefinition({
                    controller: this,
                    prefix: data.prefix.startsWith("/") ? data.prefix : `/${data.prefix}`,
                    routes: routesDefinition,
                });

                // Guarda a definição em metadados no construtor
                Reflect.defineMetadata(CONTROLLER_METADATA, definition, this);
            }
        }

        // Guarda o construtor original para comparações futuras
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA, originalConstructor, newConstructor);
        // Define que a classe é uma rota
        Reflect.defineMetadata(CONTROLLER_METADATA, true, newConstructor);

        return newConstructor;
    }
}