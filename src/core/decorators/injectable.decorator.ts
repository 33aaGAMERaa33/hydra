import { InjectableDefinition } from "../definitions/injectable.definition";
import { INJECTABLE_METADATA } from "../metadata/injectable.metadata";
import { ORIGINAL_CONSTRUCTOR_METADATA } from "../metadata/original_constructor.metadata";
import { ClassConstructor } from "../types/class_constructor.type";

export function Injectable() {
    return function<T extends ClassConstructor>(constructor: T) {
        // Pega o construtor original
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA, constructor) ?? constructor;

        // Cria um novo construtor para substituir o original
        const newConstructor = class extends constructor {
            constructor(...args: any[]) {
                super(...args);

                // Instancia a definição do injetavel e guarda em metadados na instancia
                const injectableDefinition = new InjectableDefinition<T>({
                    instance: this as any,
                });

                // Guarda a definição em metadados na instancia
                Reflect.defineMetadata(INJECTABLE_METADATA, injectableDefinition, this);
            }
        }

        // Guarda o construtor original
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA, originalConstructor, newConstructor);
        // Define que a classe é injetavel
        Reflect.defineMetadata(INJECTABLE_METADATA, true, newConstructor);

        return newConstructor;
    }
}