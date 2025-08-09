import { RouteManager } from "../../common/route_manager";
import { ControllerImplicitImpl } from "./controller_implicit.impl";
import { MiddlewareImpl } from "./middleware.impl";
import { OriginalConstructorImplicitImpl } from "./original_constructor_implicit.impl";
export interface AppConfigImplicitImpl extends OriginalConstructorImplicitImpl {
    __port: number;
    __routeManager: RouteManager;
    __middlewares: MiddlewareImpl[];
    __controllers: ControllerImplicitImpl[];
}
