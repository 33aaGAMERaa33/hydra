import { MiddlewareImpl } from "../interfaces/middleware.impl";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../metadata_key/original_constructor.metadata_key";
import { USE_MIDDLEWARE_METADATA_KEY } from "../metadata_key/use_middleware.metadata_key";
import { ClassConstructor } from "../types/class_constructor.type";
import { RouteMiddlewares } from "../types/route_middlewares.type";

export function UseMiddleware<T extends MiddlewareImpl>(middleware: ClassConstructor<T>): MethodDecorator {
    return function(target, propertyKey, _) {
        // Pega os middlewares que já foram registrados
        const middlewares: RouteMiddlewares = Reflect.getMetadata(USE_MIDDLEWARE_METADATA_KEY, target.constructor, propertyKey!) ?? [];
        const middlewareOriginalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, middleware) ?? middleware;
        // Verifica se o middleware atual já foi registrado
        // Se foi retorna para ignorar o resto do codigo
        if(middlewares.includes(middlewareOriginalConstructor)) return;
        // Adiciona o middleware na lista
        middlewares.push(middlewareOriginalConstructor);
        // Guarda os middlewares
        Reflect.defineMetadata(USE_MIDDLEWARE_METADATA_KEY, middlewares, target.constructor, propertyKey!);
    }
}