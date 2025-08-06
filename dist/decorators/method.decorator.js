"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = Method;
const route_1 = require("../common/route");
const method_metadata_key_1 = require("../metadata_key/method.metadata_key");
function Method(method, path = "") {
    return function (target, propertyKey, descriptor) {
        // Instancia a rota
        // Essa rota é instanciada antes da classe existir e da instancia dela ser criada
        // Então o handler deve ser ligado a instancia da classe após ser instanciada
        // Isso deve ser feito no decorador @Controller
        const route = new route_1.Route({
            httpMethod: method,
            propertyKey: propertyKey,
            path: path.startsWith("/") ? path : `/${path}`,
            handler: descriptor.value,
        });
        // Guarda a rota 
        Reflect.defineMetadata(method_metadata_key_1.METHOD_METADATA_KEY, route, descriptor.value);
    };
}
