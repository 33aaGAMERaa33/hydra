import { ClassConstructor } from "../core/types/class_constructor.type";
export interface OriginalConstructorImplicitImpl<T = any> {
    __constructor: ClassConstructor<T>;
}
