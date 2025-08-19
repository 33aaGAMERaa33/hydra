"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injectable = Injectable;
const injectable_definition_1 = require("../definitions/injectable.definition");
const injectable_metadata_1 = require("../metadata/injectable.metadata");
const original_constructor_metadata_1 = require("../metadata/original_constructor.metadata");
function Injectable() {
    return function (constructor) {
        // Pega o construtor original
        const originalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, constructor) ?? constructor;
        // Cria um novo construtor para substituir o original
        const newConstructor = class extends constructor {
            constructor(...args) {
                super(...args);
                // Instancia a definição do injetavel e guarda em metadados na instancia
                const injectableDefinition = new injectable_definition_1.InjectableDefinition({
                    instance: this,
                });
                // Guarda a definição em metadados na instancia
                Reflect.defineMetadata(injectable_metadata_1.INJECTABLE_METADATA, injectableDefinition, this);
            }
        };
        // Guarda o construtor original
        Reflect.defineMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, originalConstructor, newConstructor);
        // Define que a classe é injetavel
        Reflect.defineMetadata(injectable_metadata_1.INJECTABLE_METADATA, true, newConstructor);
        return newConstructor;
    };
}
