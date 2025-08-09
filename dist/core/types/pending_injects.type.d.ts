import { ClassConstructor } from "./class_constructor.type";
export type PendingInjects = Record<string | symbol, ClassConstructor>;
