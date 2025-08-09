import { Controller } from "../common/controller";
import { ControllerDefinition } from "../core/definitions/controller.definition";
import { CONTROLLER_METADATA } from "../core/metadatas/controller.metadata";
import { ORIGINAL_CONSTRUCTOR_METADATA } from "../core/metadatas/original_constructor.metadata";
import { ClassConstructor } from "../core/types/class_constructor.type";

export class DefineAppHelper {
    private constructor() {

    }

    // Metodo para instanciar os controladores e retornar apenas suas definições
    static instantiateControllers<T extends ClassConstructor<Controller>>(controllers: T[]): ControllerDefinition[] {
        const definitions: ControllerDefinition[] = [];

        // Intera sobre os construtores, instanciando e guardando suas definições
        for(const controllerConstructor of controllers) {
            // Recupera o construtor original
            const originalConstructor: ClassConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA, controllerConstructor) ?? controllerConstructor;
            // Verifica se o construtor tem metadados de controlador
            if(!Reflect.getMetadata(CONTROLLER_METADATA, controllerConstructor)) 
                throw new Error(`A classe ${originalConstructor.name} não tem metadados de controlador`);

            // Instancia o controlador e recupera sua definição
            const instance = new controllerConstructor();
            const definition: ControllerDefinition = Reflect.getMetadata(CONTROLLER_METADATA, instance);

            // Adiciona sua definição na lista
            definitions.push(definition);
        }

        return definitions;
    }
}