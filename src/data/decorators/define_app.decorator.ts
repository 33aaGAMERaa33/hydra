import { AppContract } from "../../domain/contracts/app.contract";
import { ControllerContract } from "../../domain/contracts/controller.contract";
import { AppDefinition } from "../definitions/app.definition";
import { ControllerDefinition } from "../definitions/controller.definition";
import { DefineAppHelper } from "../helpers/define_app.helper";
import { APP_METADATA } from "../metadatas/app.metadata";
import { ORIGINAL_CONSTRUCTOR_METADATA } from "../metadatas/original_constructor.metadata";
import { ClassConstructor } from "../types/class_constructor.type";

// Decorador para definir app
export function DefineApp<T>(data: {
    port: (instance: T) => number,
    controllers?: ClassConstructor<ControllerContract>[],
}) {
    return function<T extends ClassConstructor<AppContract>>(constructor: T) {
        // Recupera o construtor original
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA, constructor) ?? constructor;

        const [
            controllers,
        ] = [
            data.controllers ?? [],
        ];

        // Instancia as classes e adquire suas definições
        const controllersDefine: ControllerDefinition[] = DefineAppHelper.instantiateControllers(controllers);

        // Cria um novo construtor para substituir o original
        // Esse construtor novo vai ter uma logica adicionada a ele para preparar a aplicação
        const newConstructor = class extends constructor {
            constructor(...args: any[]) {
                super(...args);

                // Cria a definição do app e guarda em metadados na instancia
                const definition = new AppDefinition({
                    app: this,
                    port: data.port(this as any),
                    controllers: controllersDefine,
                });

                Reflect.defineMetadata(APP_METADATA, definition, this);
            }   
        };

        // Guarda o construtor original
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA, originalConstructor, newConstructor);
        // Define que a classe é um app
        Reflect.defineMetadata(APP_METADATA, true, newConstructor);

        return newConstructor;
    }
}