import { INJECT_METADATA_KEY } from "../metadata_key/inject.metadata_key";
import { PendingInjects } from "../types/pending_injects.type";

export function Inject(): PropertyDecorator {
    return function(target: Object, propertyKey: string | symbol) {
        // Pega o tipo da propriedade
        const typeInjectable = Reflect.getMetadata("design:type", target, propertyKey);
        // Pega as injeções pendentes
        const pendingInjects: PendingInjects = Reflect.getMetadata("design:type", target.constructor, propertyKey) ?? {};
        // Adiciona os dados da injeção
        pendingInjects[propertyKey] = typeInjectable;
        // Guarda os dados para injeção futura
        Reflect.defineMetadata(INJECT_METADATA_KEY, pendingInjects, target.constructor);
    }
}