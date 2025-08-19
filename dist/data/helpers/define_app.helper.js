"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefineAppHelper = void 0;
const controller_metadata_1 = require("../metadatas/controller.metadata");
const original_constructor_metadata_1 = require("../metadatas/original_constructor.metadata");
class DefineAppHelper {
    constructor() {
    }
    // Metodo para instanciar os controladores e retornar apenas suas definições
    static instantiateControllers(controllers) {
        const definitions = [];
        const prefixes = [];
        // Intera sobre os construtores, instanciando e guardando suas definições
        for (const controllerConstructor of controllers) {
            // Recupera o construtor original
            const originalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, controllerConstructor) ?? controllerConstructor;
            // Verifica se o construtor tem metadados de controlador
            if (!Reflect.getMetadata(controller_metadata_1.CONTROLLER_METADATA, controllerConstructor))
                throw new Error(`A classe ${originalConstructor.name} não tem metadados de controlador`);
            // Instancia o controlador e recupera sua definição
            const instance = new controllerConstructor();
            const definition = Reflect.getMetadata(controller_metadata_1.CONTROLLER_METADATA, instance);
            // Adiciona sua definição na lista
            definitions.push(definition);
        }
        return definitions;
    }
}
exports.DefineAppHelper = DefineAppHelper;
