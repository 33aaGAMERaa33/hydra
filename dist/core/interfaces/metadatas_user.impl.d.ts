import { ClassConstructor } from "../types/class_constructor.type";
export interface MetadatasUserImpl {
    set<T>(key: any, value: T): void;
    get<T>(key: any): T | undefined;
    getAll(): any[];
    getConstructor(): ClassConstructor;
}
