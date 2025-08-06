"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteManager = void 0;
const http_exception_1 = require("../exceptions/http.exception");
const use_middleware_metadata_key_1 = require("../metadata_key/use_middleware.metadata_key");
const response_data_helper_1 = require("../models/helpers/response_data.helper");
const route_helper_1 = require("../models/helpers/route.helper");
const http_status_enum_1 = require("../types/http_status.enum");
const middleware_type_enum_1 = require("../types/middleware_type.enum");
const context_1 = require("./context");
class RouteManager {
    // Metodo para manipular a rota
    async routeHandler(req, res, controllers, middlewares) {
        // Procura a rota referente a requisição
        const [controller, route] = this.findRoute(controllers, req.url.pathname, req.httpMethod) ?? [];
        // Se ela for encontrada executa o manipulador proprio dela
        // Caso contrario gera uma exceção http de status NOT FOUND
        if (controller && route) {
            try {
                // Pega os middlewares da rota
                const routeMiddlewares = this.getRouteMiddlewares(controller, route, middlewares);
                // Cria um contexto
                const context = new context_1.Context({
                    route: route,
                });
                // Usa os middlewares que devem ser executados antes do handler da rota
                for (const middleware of routeMiddlewares) {
                    // Verifica se é para ser executado antes da rota
                    // Se nao for pula
                    if (middleware.getType() !== middleware_type_enum_1.MiddlewareType.beforeRouteHandler)
                        continue;
                    // Pega o construtor original
                    const originalConstructor = middleware.__constructor;
                    // Executa o middleware
                    await middleware.handler(...route_helper_1.RouteHelper.buildArgs(context, req, res, originalConstructor, "handler"));
                }
                // Executa o handler da rota
                const result = await route.handler(...route_helper_1.RouteHelper.buildArgs(context, req, res, controller.__constructor, route.propertyKey));
                // Salva os dados de resposta no contexto
                context.saveData(route, result);
                // Usa os middlewares que devem ser executados depois do handler da rota
                for (const middleware of routeMiddlewares) {
                    // Verifica se é para ser executado depois da rota
                    // Se nao for pula
                    if (middleware.getType() !== middleware_type_enum_1.MiddlewareType.afterRouteHandler)
                        continue;
                    // Pega o construtor original
                    const originalConstructor = middleware.__constructor;
                    // Executa o middleware
                    await middleware.handler(...route_helper_1.RouteHelper.buildArgs(context, req, res, originalConstructor, "handler"));
                }
                // Tenta converter o resultadod do handler em algo possivel de retornar
                const data = response_data_helper_1.ResponseDataHelper.adaptResponse(context.getData(route));
                // Se a converção deu certo, registra o status como ok e define o tipo do conteudo no content-type
                // Caso contrario define o status como no_content
                if (data !== undefined) {
                    res.setStatusCode(http_status_enum_1.HttpStatus.OK);
                    res.setHeader(data?.[0]);
                }
                else
                    res.setStatusCode(http_status_enum_1.HttpStatus.NO_CONTENT);
                // Envia a resposta
                res.sendResponse(data?.[1]);
            }
            catch (e) {
                this.routeException(res, e);
            }
        }
        else {
            this.routeException(res, new http_exception_1.HttpException(http_status_enum_1.HttpStatus.NOT_FOUND));
        }
    }
    // Metodo para pegar os middlewares da rota
    getRouteMiddlewares(controller, route, middlewares) {
        const routeMiddlewares = [];
        // Pega os middlewares da rota
        const routeMiddlewaresToUse = Reflect.getMetadata(use_middleware_metadata_key_1.USE_MIDDLEWARE_METADATA_KEY, controller.__constructor, route.propertyKey) ?? [];
        // Intera sobre os middlewares para incluir apenas os middlewares da rota
        for (const routeMiddleware of routeMiddlewaresToUse.toReversed()) {
            for (const middleware of middlewares) {
                // Pega o construtor original do middleware
                const originalConstructor = middleware.__constructor;
                // Verifica se os construtores são iguais
                // Se não forem pula ele
                if (routeMiddleware !== originalConstructor)
                    continue;
                // Adiciona o middlewre na rota
                routeMiddlewares.push(middleware);
            }
        }
        return routeMiddlewares;
    }
    // Metodo que cuida das exceções da rota
    routeException(res, e) {
        if (e instanceof http_exception_1.HttpException) {
            // Tenta transforma o conteudo da mensagem em algo possivel de enviar
            const data = response_data_helper_1.ResponseDataHelper.adaptResponse(e.message);
            // Verifica se foi possivel transformar
            // Se foi registra o tipo do conteudo no header 
            if (data !== undefined)
                res.setHeader(data[0]);
            // Retorna o conteudo e o status de resposta
            res.setStatusCode(e.status);
            res.sendResponse(data?.[1]);
        }
        else {
            res.setStatusCode(http_status_enum_1.HttpStatus.INTERNAL_SERVER_ERROR);
            res.sendResponse();
        }
    }
    findRoute(controllers, path, httpMethod) {
        // Intera sobre os controladores fornecidos e nas rotas desses controladores para procurar pela rota
        for (const controller of controllers) {
            // Intera sobre as rotas para verificar se ela é compativel com o caminho e metodo fornecido
            for (const route of controller.__routes) {
                // Verifica se a rota é compativel com o caminho e metodo fornecido
                // Se for retorna o controlador e a rota
                if (route.forThis(path, httpMethod))
                    return [controller, route];
            }
        }
        // Retorna undefinido caso a rota não tenha sido encontrada
        return undefined;
    }
}
exports.RouteManager = RouteManager;
