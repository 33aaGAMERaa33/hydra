import { AppDefinition } from "../definitions/app.definition";
import { ControllerDefinition } from "../definitions/controller.definition";
import { RouteDefinition } from "../definitions/route.definition";
import { Context } from "./context";
export declare class RouteManager {
    manageRoute(context: Context, appDefinition: AppDefinition): Promise<void>;
    protected findRoute(context: Context, appDefinition: AppDefinition): [ControllerDefinition, RouteDefinition] | undefined;
}
