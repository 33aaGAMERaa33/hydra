import { ClassConstructor } from "../types/class_constructor.type";
export interface OriginalConstructorImplicitImpl<T = any> {
    __constructor: ClassConstructor<T>;
}
