"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = Middleware;
const middleware_metadata_key_1 = require("../metadata_key/middleware.metadata_key");
const original_constructor_metadata_key_1 = require("../metadata_key/original_constructor.metadata_key");
function Middleware(constructor) {
    // Pega o construtor original
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
    // Define no construtor que a classe é um middleware
    Reflect.defineMetadata(middleware_metadata_key_1.MIDDLEWARE_METADATA_KEY, true, newConstructor);
    return newConstructor;
}
