import { MiddlewareImpl } from "../../interfaces/middleware.impl";
import { MIDDLEWARE_METADATA } from "../metadata/middleware.metadata";
import { ORIGINAL_CONSTRUCTOR_METADATA } from "../metadata/original_constructor.metadata";
import { HANDLER_PARAMETERS_METADATA } from "../metadata/handler_parameters.metadata";
import { ClassConstructor } from "../types/class_constructor.type";
import { MiddlewareDefinition } from "./middleware.definition";

export function Middleware<T extends ClassConstructor<MiddlewareImpl>>(constructor: T) {
    // Pega o construtor original
    const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA, constructor) ?? constructor;
    // Pega os argumentos que o handler precisa
    const handlerArgs = Reflect.getMetadata(HANDLER_PARAMETERS_METADATA, constructor, "handler");

    // Cria um novo construtor para substituir o original
    const newConstructor = class extends constructor {
        constructor(...args: any[]) {
            super(...args);

            // Instancia a definição do middleware e guarda em metadados na instancia
            const middlewareDefinition = new MiddlewareDefinition({
                instance: this as any,
                handlerArgs: handlerArgs,
                handler: this.handler.bind(this),
            });

            Reflect.defineMetadata(MIDDLEWARE_METADATA, middlewareDefinition, this);
        }
    };

    // Guarda o construtor original em metadados
    Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA, originalConstructor, newConstructor);
    // Define que a classe é um middleware
    Reflect.defineMetadata(MIDDLEWARE_METADATA, true, newConstructor);

    return newConstructor;
}