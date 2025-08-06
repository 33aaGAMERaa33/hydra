"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inject = Inject;
const inject_metadata_key_1 = require("../metadata_key/inject.metadata_key");
function Inject() {
    return function (target, propertyKey) {
        // Pega o tipo da propriedade
        const typeInjectable = Reflect.getMetadata("design:type", target, propertyKey);
        // Pega as injeções pendentes
        const pendingInjects = Reflect.getMetadata("design:type", target.constructor, propertyKey) ?? {};
        // Adiciona os dados da injeção
        pendingInjects[propertyKey] = typeInjectable;
        // Guarda os dados para injeção futura
        Reflect.defineMetadata(inject_metadata_key_1.INJECT_METADATA_KEY, pendingInjects, target.constructor);
    };
}
