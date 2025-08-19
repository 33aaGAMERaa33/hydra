"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inject = Inject;
const inject_metadata_1 = require("../metadata/inject.metadata");
const injectable_metadata_1 = require("../metadata/injectable.metadata");
const original_constructor_metadata_1 = require("../metadata/original_constructor.metadata");
function Inject() {
    return function (target, propertyKey) {
        // Pega as injeções pendentes
        const pendingInjects = Reflect.getMetadata(inject_metadata_1.INJECT_METADATA, target.constructor) ?? {};
        // Pega o tipo da injeção
        const inject = Reflect.getMetadata("design:type", target, propertyKey);
        // Pega os valores guardados em metadados
        const isInjectable = Reflect.getMetadata(injectable_metadata_1.INJECTABLE_METADATA, inject);
        const originalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, inject);
        // Verifica se a classe é injetavel e se o construtor original ainda existe
        // Se algo der errado gera um erro
        if (!isInjectable || originalConstructor === undefined)
            throw new Error(`Não é possivel injetar na propriedade ${propertyKey.toString()} de ${target.constructor.name} pois o tipo não é injetável`);
        // Adiciona a injeção atual no mapa
        pendingInjects[propertyKey] = inject;
        // Guarda as injeções atualizadas no construtor da classe
        Reflect.defineMetadata(inject_metadata_1.INJECT_METADATA, pendingInjects, target.constructor);
    };
}
