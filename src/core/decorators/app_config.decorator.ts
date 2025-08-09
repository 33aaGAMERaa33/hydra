import { RouteManager } from "../../common/route_manager";
import { AppConfigHelper } from "../../helpers/app_config.helper";
import { MiddlewareImpl } from "../../interfaces/middleware.impl";
import { AppDefinition } from "../definitions/app.definition";
import { ControllerDefinition } from "../definitions/controller.definition";
import { InjectableDefinition } from "../definitions/injectable.definition";
import { MiddlewareDefinition } from "../definitions/middleware.definition";
import { APP_METADATA } from "../metadata/app_config.metadata";
import { ORIGINAL_CONSTRUCTOR_METADATA } from "../metadata/original_constructor.metadata";
import { ClassConstructor } from "../types/class_constructor.type";

export function AppConfig<T>(data: {
    port: (instance: T) => number,
    routeManager?: RouteManager,
    controllers?: ClassConstructor[],
    injectables?: ClassConstructor[],
    middlewares?: ClassConstructor<MiddlewareImpl>[],
}) {
    return function<T extends ClassConstructor>(constructor: T) {
        // Pega o construtor original da classe
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA, constructor) ?? constructor;
        const [
            controllersConstructor,
            injectablesConstructor,
            middlewaresConstructor,
        ] = [
            data.controllers ?? [],
            data.injectables ?? [],
            data.middlewares ?? [],
        ];

        // Instancia as classes fornecidas
        const injectablesDefinition: InjectableDefinition[] = AppConfigHelper.instantiateInjectables(injectablesConstructor);
        const middlewaresDefinition: MiddlewareDefinition[] = AppConfigHelper.instantiateMiddlewares(middlewaresConstructor);
        const controllersDefinition: ControllerDefinition[] = AppConfigHelper.instantiateControllers(controllersConstructor, middlewaresDefinition);

        // Configuração para resolução de dependencias
        const config = {
            ignoreNotResolved: false,
            passAlreadyResolved: true,
        };

        // Resolve as dependencias das instancias
        for(const definition of [
            ...injectablesDefinition,
            ...middlewaresDefinition,
            ...controllersDefinition,
        ]) {
            AppConfigHelper.resolveDependences(definition, injectablesDefinition, config);
        }

        // Define um novo construtor para substituir o construtor original
        const newConstructor = class extends constructor {
            constructor(...args: any[]) {
                super(...args);

                // Instancia a definição da aplicação
                const appDefinition = new AppDefinition<T>({
                    instance: this as any,
                    port: data.port(this as any),
                    controllers: controllersDefinition,
                    injectables: injectablesDefinition,
                    routeManager: data.routeManager ?? new RouteManager(),
                });

                // Guarda a definição da aplicação em metadados na instancia
                Reflect.defineMetadata(APP_METADATA, appDefinition, this);
            }
        };

        // Guarda o construtor original em metadados
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA, originalConstructor, newConstructor);
        // Define no construtor que a classe é um app
        Reflect.defineMetadata(APP_METADATA, true, newConstructor);
        // Retorna o novo construtor
        return newConstructor;
    }
}