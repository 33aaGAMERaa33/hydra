import { ControllerImplicitImpl } from "../../interfaces/controller_implicit.impl";
import { InjectableImplicitImpl } from "../../interfaces/injectable_implicit.impl";
import { MiddlewareImpl } from "../../interfaces/middleware.impl";
import { OriginalConstructorImplicitImpl } from "../../interfaces/original_constructor_implicit.impl";
import { ClassConstructor } from "../../types/class_constructor.type";
export declare class AppConfigHelper {
    private constructor();
    static instantiateControllers<T extends ClassConstructor>(controllersConstructor: T[]): ControllerImplicitImpl[];
    static instantiateInjectables<T extends ClassConstructor>(injectablesConstructor: T[]): InjectableImplicitImpl[];
    static instantiateMiddlewares<T extends MiddlewareImpl>(middlewaresConstructor: ClassConstructor<T>[]): MiddlewareImpl[];
    static resolveDependences<T extends OriginalConstructorImplicitImpl>(instances: T[], injectables: InjectableImplicitImpl[], data?: {
        passAlreadyResolved: boolean;
        ignoreNotResolved: boolean;
    }): void;
}
