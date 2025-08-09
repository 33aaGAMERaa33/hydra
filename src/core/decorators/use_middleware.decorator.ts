import { MiddlewareImpl } from "../../interfaces/middleware.impl";
import { USE_MIDDLEWARE_METADATA } from "../metadata/use_middleware.metadata";
import { ClassConstructor } from "../types/class_constructor.type";

export function UseMiddleware<T extends ClassConstructor<MiddlewareImpl>>(middlewareConstructor: T): MethodDecorator {
    return function(target, propertyKey, _) {
        // Pega os middlewares que vão ser usados
        const middlewares: T[] = Reflect.getMetadata(USE_MIDDLEWARE_METADATA, target.constructor, propertyKey) ?? [];

        // Se o middleware já foi adicionado ignora o restante do codigo
        if(middlewares.includes(middlewareConstructor)) return;
        // Adiciona o construtor original do middleware na lista
        middlewares.push(middlewareConstructor);
        // Guarda os middlewares atualizados em metadados no metodo
        Reflect.defineMetadata(USE_MIDDLEWARE_METADATA, middlewares, target.constructor, propertyKey);
    } 
}