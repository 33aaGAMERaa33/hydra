import { RouteManager } from "../common/route_manager";
import { AppConfigImplicitImpl } from "../interfaces/app_config_implicit.impl";
import { ControllerImplicitImpl } from "../interfaces/controller_implicit.impl";
import { InjectableImplicitImpl } from "../interfaces/injectable_implicit.impl";
import { MiddlewareImpl } from "../interfaces/middleware.impl";
import { APP_CONFIG_METADATA_KEY } from "../metadata_key/app_config.metadata_key";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../metadata_key/original_constructor.metadata_key";
import { AppConfigHelper } from "../models/helpers/app_config.helper";
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
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
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
        const injectablesInstance: InjectableImplicitImpl[] = AppConfigHelper.instantiateInjectables(injectablesConstructor);
        const controllersInstance: ControllerImplicitImpl[] = AppConfigHelper.instantiateControllers(controllersConstructor);
        const middlewaresInstance: MiddlewareImpl[] = AppConfigHelper.instantiateMiddlewares(middlewaresConstructor);

        // Define um novo construtor para substituir o construtor original
        const newConstructor = class extends constructor implements AppConfigImplicitImpl {
            __port!: number;
            __constructor: ClassConstructor = originalConstructor;
            __middlewares: MiddlewareImpl[] = middlewaresInstance;
            __controllers: ControllerImplicitImpl[] = controllersInstance;
            __routeManager: RouteManager = data.routeManager ?? new RouteManager();

            constructor(...args: any[]) {
                super(...args);
                // inicializa a propriedade que define a porta do servidor
                this.__port = data.port(this as any);

                const config = {
                    ignoreNotResolved: false,
                    passAlreadyResolved: true,
                };

                // Resolve as dependencias pendentes
                AppConfigHelper.resolveDependences(injectablesInstance, injectablesInstance, config);
                AppConfigHelper.resolveDependences(controllersInstance, injectablesInstance, config);
            }
        };

        // Guarda o construtor original em metadados
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
        // Define no construtor que a classe é um app
        Reflect.defineMetadata(APP_CONFIG_METADATA_KEY, true, newConstructor);
        // Retorna o novo construtor
        return newConstructor;
    }
}