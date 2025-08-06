import { Route } from "../common/route";
import { ControllerImplicitImpl } from "../interfaces/controller_implicit.impl";
import { CONTROLLER_METADATA_KEY } from "../metadata_key/controller.metadata_key";
import { METHOD_METADATA_KEY } from "../metadata_key/method.metadata_key";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../metadata_key/original_constructor.metadata_key";
import { ClassConstructor } from "../types/class_constructor.type";

export function Controller() {
    return function<T extends ClassConstructor>(constructor: T) {
        // Pega o construtor original
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor

        // Cria um novo construtor para substituir o atual
        const newConstructor = class extends constructor implements ControllerImplicitImpl {
            readonly __routes: Route[] = [];
            readonly __constructor: ClassConstructor<any> = originalConstructor;

            constructor(...args: any[]) {
                super(...args);

                // Intera sobre os metodos da classe para procurar as rotas
                for(const [_, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(constructor.prototype))) {
                    // Tenta pegar o valor padrão da rota
                    const route: Route | undefined = Reflect.getMetadata(METHOD_METADATA_KEY, descriptor.value);
                    // Verifica se esse valor existe
                    // Esse valor só existe se o metodo for decorado com @Method
                    if(route === undefined) continue;

                    // Verifica se a rota está repitida
                    // Se estiver gera um erro
                    for(const otherRoute of this.__routes) {
                        if(route.equals(otherRoute)) 
                            throw new Error(`A rota ${route.path} via ${route.httpMethod} está duplicada no controlador ${originalConstructor.name}`);
                    }

                    // Instancia uma nova rota com os mesmos atributos da antiga, porem com o handler linkado com a instancia
                    this.__routes.push(route.cloneWith({
                        handler: route.handler.bind(this),
                    }));
                }
            }
        }

        // Salva o construtor original
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
        // Define que a classe é um controlador no construtor
        Reflect.defineMetadata(CONTROLLER_METADATA_KEY, true, newConstructor);

        // Substitui o construtor atual
        return newConstructor;
    }
}