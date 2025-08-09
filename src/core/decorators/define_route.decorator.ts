import { RouteImpl } from "../../interfaces/route.impl";
import { RouteDefinition } from "../definitions/route.definition";
import { HttpMethod } from "../enums/http_method.enum";
import { ORIGINAL_CONSTRUCTOR_METADATA } from "../metadatas/original_constructor.metadata";
import { ROUTE_METADATA } from "../metadatas/route.metadata";
import { ClassConstructor } from "../types/class_constructor.type";

// Decorador para declarar rotas
export function DefineRoute(data: {
    path: string,
    method: HttpMethod,
}) {
    return function<T extends ClassConstructor<RouteImpl>>(constructor: T) {
        // Recupera o construtor original guardado em metadados
        const originalConstructor: ClassConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA, constructor) ?? constructor;

        // Cria um novo construtor para a classe
        // Isso é feito para adicionar logica no instanciamento da classe
        const newConstructor = class extends constructor {
            constructor(...args: any[]){
                super(...args);

                // Instancia uma definição de rota com a instancia atual
                const routeDefinition = new RouteDefinition({
                    route: this,
                    method: data.method,
                    path: data.path.startsWith("/") ? data.path : `/${data.path}`,
                });

                // Guarda a definição da rota em metadados na instancia
                Reflect.defineMetadata(ROUTE_METADATA, routeDefinition, this);
            }
        }

        // Guarda o construtor original para comparações futuras
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA, originalConstructor, newConstructor);
        // Define que a classe é uma rota
        Reflect.defineMetadata(ROUTE_METADATA, true, newConstructor);

        return newConstructor;
    }
}