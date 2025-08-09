import { Controller } from "../../common/controller";
import { RouteCache } from "../../common/route_cache";
import { HttpMethod } from "../enums/http_method.enum";
import { RouteDefinition } from "./route.definition";

export class ControllerDefinition {
    readonly prefix: string;
    readonly controller: Controller;
    readonly routes: RouteDefinition[];
    readonly routeCache: RouteCache = new RouteCache();

    constructor(data: {
        prefix: string,
        controller: Controller,
        routes: RouteDefinition[],
    }) {
        this.prefix = data.prefix;
        this.routes = data.routes;
        this.controller = data.controller;

        for(const route of this.routes) {
            this.routeCache.add(`${route.method}:${route.path}`, route);
            
            Object.defineProperty(route.route, "controller", {
                value: this.controller, 
                writable: false,
            });
        }
    }

    findRoute(path: string, method: HttpMethod): RouteDefinition | undefined {
        return this.routeCache.get(`${method}:${path}`);
    } 
}