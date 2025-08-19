import { MiddlewareType } from "../core/types/middleware_type.enum";
export interface MiddlewareImpl {
    getType(): MiddlewareType;
    handler(...args: any[]): any;
}
