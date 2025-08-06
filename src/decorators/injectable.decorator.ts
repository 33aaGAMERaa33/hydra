import { InjectableImplicitImpl } from "../interfaces/injectable_implicit.impl";
import { INJECTABLE_METADATA_KEY } from "../metadata_key/injectable.metadata_key";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../metadata_key/original_constructor.metadata_key";
import { ClassConstructor } from "../types/class_constructor.type";

export function Injectable() {
    return function<T extends ClassConstructor>(constructor: T) {
        // Pega o construtor original da classe
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;

        // Cria um novo construtor para substituir o original
        const newConstructor = class extends constructor implements InjectableImplicitImpl {
            readonly __constructor: ClassConstructor<any> = originalConstructor;

            constructor(...args: any[]) {
                super(...args);
            }
        }

        // Guarda o construtor original
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
        // Define no construtor que a classe é injetavel
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, newConstructor);

        return newConstructor;
    }
}