import { RouteContract } from "../../domain/contracts/route.contract";
import { RouteDefinition } from "../definitions/route.definition";
import { HttpMethod } from "../enums/http_method.enum";
import { HANDLER_PARAMETERS } from "../metadatas/handler_parameters.metadata";
import { ORIGINAL_CONSTRUCTOR_METADATA } from "../metadatas/original_constructor.metadata";
import { ROUTE_METADATA } from "../metadatas/route.metadata";
import { ClassConstructor } from "../types/class_constructor.type";
import { HandlerParameters } from "../types/handler_parameters.type";

// Decorador para declarar rotas
export function DefineRoute(data: {
    path?: string,
    method: HttpMethod,
}) {
    return function<T extends ClassConstructor<RouteContract>>(constructor: T) {
        // Recupera dados guardados nos metadados
        const originalConstructor: ClassConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA, constructor) ?? constructor;
        const handlerParameters: HandlerParameters = Reflect.getMetadata(HANDLER_PARAMETERS, constructor) ?? {};

        // Cria um novo construtor para a classe
        // Isso é feito para adicionar logica no instanciamento da classe
        const newConstructor = class extends (constructor as any) {
            constructor(...args: any[]){
                super(...args);

                // Instancia uma definição de rota com a instancia atual
                const routeDefinition = new RouteDefinition({
                    route: this as any,
                    method: data.method,
                    parameters: handlerParameters,
                    path: data.path ? data.path.trim() : "",
                });

                // Guarda a definição da rota em metadados na instancia
                Reflect.defineMetadata(ROUTE_METADATA, routeDefinition, this);
            }
        }

        // Guarda o construtor original para comparações futuras
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA, originalConstructor, newConstructor);
        // Define que a classe é uma rota
        Reflect.defineMetadata(ROUTE_METADATA, true, newConstructor);

        return newConstructor as T;
    }
}