import { HttpException } from "../exceptions/http.exception";
import { ControllerImplicitImpl } from "../interfaces/controller_implicit.impl";
import { MiddlewareImpl } from "../interfaces/middleware.impl";
import { OriginalConstructorImplicitImpl } from "../interfaces/original_constructor_implicit.impl";
import { USE_MIDDLEWARE_METADATA_KEY } from "../metadata_key/use_middleware.metadata_key";
import { ResponseDataHelper } from "../models/helpers/response_data.helper";
import { RouteHelper } from "../models/helpers/route.helper";
import { HttpMethod } from "../types/http_method.enum";
import { HttpStatus } from "../types/http_status.enum";
import { RouteMiddlewares } from "../types/route_middlewares.type";
import { HydraRequest } from "./hydra_request";
import { HydraResponse } from "./hydra_response";
import { Route } from "./route";
import { ClassConstructor } from "../types/class_constructor.type";
import { MiddlewareType } from "../types/middleware_type.enum";
import { Context } from "./context";

export class RouteManager {
    // Metodo para manipular a rota
    async routeHandler(req: HydraRequest, res: HydraResponse, controllers: ControllerImplicitImpl[], middlewares: MiddlewareImpl[]): Promise<void> {
        // Procura a rota referente a requisição
        const [controller, route] = this.findRoute(controllers, req.url.pathname, req.httpMethod) ?? [];
        // Se ela for encontrada executa o manipulador proprio dela
        // Caso contrario gera uma exceção http de status NOT FOUND
        if(controller && route) {
            try {
                // Pega os middlewares da rota
                const routeMiddlewares = this.getRouteMiddlewares(controller, route, middlewares);
                // Cria um contexto
                const context = new Context({
                    route: route,
                });
                // Usa os middlewares que devem ser executados antes do handler da rota
                for(const middleware of routeMiddlewares) {
                    // Verifica se é para ser executado antes da rota
                    // Se nao for pula
                    if(middleware.getType() !== MiddlewareType.beforeRouteHandler) continue;
                    // Pega o construtor original
                    const originalConstructor: ClassConstructor = (middleware as unknown as OriginalConstructorImplicitImpl).__constructor;
                    // Executa o middleware
                    await middleware.handler(...RouteHelper.buildArgs(context, req, res, originalConstructor, "handler"));
                }

                // Executa o handler da rota
                const result = await route.handler(...RouteHelper.buildArgs(context, req, res, controller.__constructor, route.propertyKey));
                // Salva os dados de resposta no contexto
                context.saveData(route, result);
                // Usa os middlewares que devem ser executados depois do handler da rota
                for(const middleware of routeMiddlewares) {
                    // Verifica se é para ser executado depois da rota
                    // Se nao for pula
                    if(middleware.getType() !== MiddlewareType.afterRouteHandler) continue;
                    // Pega o construtor original
                    const originalConstructor: ClassConstructor = (middleware as unknown as OriginalConstructorImplicitImpl).__constructor;
                    // Executa o middleware
                    await middleware.handler(...RouteHelper.buildArgs(context, req, res, originalConstructor, "handler"));
                }
                // Tenta converter o resultadod do handler em algo possivel de retornar
                const data = ResponseDataHelper.adaptResponse(context.getData(route));

                // Se a converção deu certo, registra o status como ok e define o tipo do conteudo no content-type
                // Caso contrario define o status como no_content
                if(data !== undefined) {
                    res.setStatusCode(HttpStatus.OK);
                    res.setHeader(data?.[0]);
                }else res.setStatusCode(HttpStatus.NO_CONTENT);

                // Envia a resposta
                res.sendResponse(data?.[1]);
            }catch(e) {
                this.routeException(res, e);
            }
        }else {
            this.routeException(res, new HttpException(HttpStatus.NOT_FOUND))
        }
    }

    // Metodo para pegar os middlewares da rota
    protected getRouteMiddlewares(controller: ControllerImplicitImpl, route: Route, middlewares: MiddlewareImpl[]): MiddlewareImpl[] {
        const routeMiddlewares: MiddlewareImpl[] = [];
        // Pega os middlewares da rota
        const routeMiddlewaresToUse: RouteMiddlewares = Reflect.getMetadata(USE_MIDDLEWARE_METADATA_KEY, controller.__constructor, route.propertyKey) ?? [];
        
        // Intera sobre os middlewares para incluir apenas os middlewares da rota
        for(const routeMiddleware of routeMiddlewaresToUse.toReversed()) {
            for(const middleware of middlewares) {
                // Pega o construtor original do middleware
                const originalConstructor: ClassConstructor = (middleware as unknown as OriginalConstructorImplicitImpl).__constructor;
                // Verifica se os construtores são iguais
                // Se não forem pula ele
                if(routeMiddleware !== originalConstructor) continue;

                // Adiciona o middlewre na rota
                routeMiddlewares.push(middleware);
            }
        }
        
        return routeMiddlewares;
    }

    // Metodo que cuida das exceções da rota
    protected routeException(res: HydraResponse, e: any) {
        if(e instanceof HttpException) {
            // Tenta transforma o conteudo da mensagem em algo possivel de enviar
            const data = ResponseDataHelper.adaptResponse(e.message);

            // Verifica se foi possivel transformar
            // Se foi registra o tipo do conteudo no header 
            if(data !== undefined) res.setHeader(data[0]);

            // Retorna o conteudo e o status de resposta
            res.setStatusCode(e.status);
            res.sendResponse(data?.[1]);
        }else {
            res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
            res.sendResponse();
        }
    }

    protected findRoute(controllers: ControllerImplicitImpl[], path: string, httpMethod: HttpMethod): [ControllerImplicitImpl, Route] | undefined {
        // Intera sobre os controladores fornecidos e nas rotas desses controladores para procurar pela rota
        for(const controller of controllers) {
            // Intera sobre as rotas para verificar se ela é compativel com o caminho e metodo fornecido
            for(const route of controller.__routes) {
                // Verifica se a rota é compativel com o caminho e metodo fornecido
                // Se for retorna o controlador e a rota
                if(route.forThis(path, httpMethod)) return [controller, route];
            }
        }

        // Retorna undefinido caso a rota não tenha sido encontrada
        return undefined;
    }
}