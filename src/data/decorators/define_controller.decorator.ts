import { ControllerContract } from "../../domain/contracts/controller.contract";
import { RouteContract } from "../../domain/contracts/route.contract";
import { ControllerDefinition } from "../definitions/controller.definition";
import { RouteDefinition } from "../definitions/route.definition";
import { CONTROLLER_METADATA } from "../metadatas/controller.metadata";
import { ORIGINAL_CONSTRUCTOR_METADATA } from "../metadatas/original_constructor.metadata";
import { ROUTE_METADATA } from "../metadatas/route.metadata";
import { ClassConstructor } from "../types/class_constructor.type";

// Decorador para definir um controlador
export function DefineController(data: {
    routes: ClassConstructor<RouteContract>[],
}) {
    return function<T extends ClassConstructor<ControllerContract>>(constructor: T) {        
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

                    // Verifica se o caminho da rota está duplicado
                    // Se estiver gera um erro
                    for(const otherDefinition of routesDefinition) {
                        // Pega o construtor original das rotas
                        const thisRouteOriginalConstructor: ClassConstructor = Reflect.getMetadata(
                            ORIGINAL_CONSTRUCTOR_METADATA, Object.getPrototypeOf(definition.route).constructor,
                        );
                        const otherRouteOriginalConstructor: ClassConstructor = Reflect.getMetadata(
                            ORIGINAL_CONSTRUCTOR_METADATA, Object.getPrototypeOf(otherDefinition.route).constructor,
                        );

                        const r1ConstructorName = thisRouteOriginalConstructor.name;
                        const r2ConstructorName = otherRouteOriginalConstructor.name;
                        
                        // Verifica se ambas as rotas são do mesmo destino
                        // Se foram gera um erro
                        if(definition.equalsPath(otherDefinition)) 
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
                const definition = new ControllerDefinition({
                    controller: this,
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