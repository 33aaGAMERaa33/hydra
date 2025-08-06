import { Route } from "../common/route";
import { METHOD_METADATA_KEY } from "../metadata_key/method.metadata_key";
import { HttpMethod } from "../types/http_method.enum";

export function Method(method: HttpMethod, path: string = ""): MethodDecorator {
    return function(target, propertyKey, descriptor) {
        // Instancia a rota
        // Essa rota é instanciada antes da classe existir e da instancia dela ser criada
        // Então o handler deve ser ligado a instancia da classe após ser instanciada
        // Isso deve ser feito no decorador @Controller
        const route = new Route({
            httpMethod: method,
            propertyKey: propertyKey,
            path: path.startsWith("/") ? path : `/${path}`,
            handler: (descriptor.value! as (...args: any[]) => any),
        });

        // Guarda a rota 
        Reflect.defineMetadata(METHOD_METADATA_KEY, route, descriptor.value!);
    }
}