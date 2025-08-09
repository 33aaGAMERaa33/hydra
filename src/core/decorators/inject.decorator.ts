import { INJECT_METADATA } from "../metadata/inject.metadata"
import { INJECTABLE_METADATA } from "../metadata/injectable.metadata";
import { ORIGINAL_CONSTRUCTOR_METADATA } from "../metadata/original_constructor.metadata";
import { PendingInjects } from "../types/pending_injects.type";

export function Inject(): PropertyDecorator {
    return function(target, propertyKey) {
        // Pega as injeções pendentes
        const pendingInjects: PendingInjects = Reflect.getMetadata(INJECT_METADATA, target.constructor) ?? {};
        // Pega o tipo da injeção
        const inject = Reflect.getMetadata("design:type", target, propertyKey);

        // Pega os valores guardados em metadados
        const isInjectable = Reflect.getMetadata(INJECTABLE_METADATA, inject);
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA, inject);

        // Verifica se a classe é injetavel e se o construtor original ainda existe
        // Se algo der errado gera um erro
        if(!isInjectable || originalConstructor === undefined)
            throw new Error(`Não é possivel injetar na propriedade ${propertyKey.toString()} de ${target.constructor.name} pois o tipo não é injetável`);

        // Adiciona a injeção atual no mapa
        pendingInjects[propertyKey] = inject;

        // Guarda as injeções atualizadas no construtor da classe
        Reflect.defineMetadata(INJECT_METADATA, pendingInjects, target.constructor);
    }
}