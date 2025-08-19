import { Route } from "../../common/route";
import { OriginalConstructorImplicitImpl } from "./original_constructor_implicit.impl";
export interface ControllerImplicitImpl extends OriginalConstructorImplicitImpl {
    __routes: Route[];
}
