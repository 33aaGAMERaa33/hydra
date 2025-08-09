import { Definition } from "../../interfaces/definition.impl";
import { RouteDefinition } from "./route.definition";

export class ControllerDefinition<T = any> implements Definition<T> {
    readonly instance: T;
    readonly routesDefinition: RouteDefinition[];

    constructor(data: {
        instance: T,
        routesDefinition: RouteDefinition[],
    }) {
        this.instance = data.instance;
        this.routesDefinition = data.routesDefinition;
    }
}