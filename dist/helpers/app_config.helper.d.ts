import { ControllerDefinition } from "../core/definitions/controller.definition";
import { InjectableDefinition } from "../core/definitions/injectable.definition";
import { MiddlewareDefinition } from "../core/definitions/middleware.definition";
import { ClassConstructor } from "../core/types/class_constructor.type";
import { Definition } from "../interfaces/definition.impl";
import { MiddlewareImpl } from "../interfaces/middleware.impl";
export declare class AppConfigHelper {
    private constructor();
    static instantiateControllers<T extends ClassConstructor>(controllersConstructor: T[], middlewaresDefinition: MiddlewareDefinition[]): ControllerDefinition<any>[];
    static instantiateInjectables(injectablesConstructor: ClassConstructor[]): InjectableDefinition[];
    static instantiateMiddlewares<T extends ClassConstructor<MiddlewareImpl>>(middlewaresConstructor: T[]): MiddlewareDefinition[];
    static resolveDependences<T>(definition: Definition<T>, injectables: InjectableDefinition[], data: {
        ignoreNotResolved: boolean;
        passAlreadyResolved: boolean;
    }): void;
}
