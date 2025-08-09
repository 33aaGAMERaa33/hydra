"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injectable = Injectable;
const injectable_metadata_key_1 = require("../metadata_key/injectable.metadata_key");
const original_constructor_metadata_key_1 = require("../metadata_key/original_constructor.metadata_key");
function Injectable() {
    return function (constructor) {
        // Pega o construtor original da classe
        const originalConstructor = Reflect.getMetadata(original_constructor_metadata_key_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
        // Cria um novo construtor para substituir o original
        const newConstructor = class extends constructor {
            __constructor = originalConstructor;
            constructor(...args) {
                super(...args);
            }
        };
        // Guarda o construtor original
        Reflect.defineMetadata(original_constructor_metadata_key_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
        // Define no construtor que a classe é injetavel
        Reflect.defineMetadata(injectable_metadata_key_1.INJECTABLE_METADATA_KEY, true, newConstructor);
        return newConstructor;
    };
}
