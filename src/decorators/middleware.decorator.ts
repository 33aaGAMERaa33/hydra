import { MiddlewareImpl } from "../interfaces/middleware.impl";
import { OriginalConstructorImplicitImpl } from "../interfaces/original_constructor_implicit.impl";
import { MIDDLEWARE_METADATA_KEY } from "../metadata_key/middleware.metadata_key";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../metadata_key/original_constructor.metadata_key";
import { ClassConstructor } from "../types/class_constructor.type";
import { MiddlewareType } from "../types/middleware_type.enum";

export function Middleware<T extends ClassConstructor<MiddlewareImpl>>(constructor: T) {
    // Pega o construtor original
    const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
    // Cria um novo construtor para substituir o original
    const newConstructor = class extends constructor implements OriginalConstructorImplicitImpl {
        __constructor: ClassConstructor<any> = originalConstructor;

        constructor(...args: any[]) {
            super(...args);
        }
    }
    
    // Guarda o construtor original
    Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
    // Define no construtor que a classe é um middleware
    Reflect.defineMetadata(MIDDLEWARE_METADATA_KEY, true, newConstructor);

    return newConstructor;
}