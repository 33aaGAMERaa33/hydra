"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteManager = void 0;
const http_exception_1 = require("../core/exceptions/http.exception");
const http_status_enum_1 = require("../core/types/http_status.enum");
const response_data_helper_1 = require("../helpers/response_data.helper");
const route_helper_1 = require("../helpers/route.helper");
const context_1 = require("./context");
class RouteManager {
    routeCache = new Map();
    // Metodo para manipular a rota
    async routeHandler(req, res, controllers) {
        // Procura a rota referente a requisição
        const [controller, routeDefinition] = this.findRoute(controllers, req.url.pathname, req.httpMethod) ?? [];
        // Se ela for encontrada executa o manipulador proprio dela
        // Caso contrario gera uma exceção http de status NOT FOUND
        if (controller && routeDefinition) {
            try {
                // Constroi o contexto
                const context = new context_1.Context({
                    route: routeDefinition,
                });
                // Constroi a lista de argumentos que os handlers vão usar
                const args = route_helper_1.HandlerHelper.buildArgs(context, req, res);
                // Executa os middlewares que devem ser executados antes do handler da rota
                for (const middlewareDefinition of routeDefinition.beforeHandlerMiddlewares) {
                    await middlewareDefinition.runHandler(args);
                }
                // Chama o handler da rota
                const result = await routeDefinition.runHandler(args);
                // Salva o resultado no contexto para que seja possivel dos middlewares alterarem se necessario
                context.saveData(routeDefinition, result);
                // Executa os middlewares que devem ser executados depois do handler da rota
                for (const middlewareDefinition of routeDefinition.afterHandlerMiddlewares) {
                    await middlewareDefinition.runHandler(args);
                }
                // Adapta o resultado para a resposta
                const [header, data] = response_data_helper_1.ResponseDataHelper.adaptResponse(context.getData(routeDefinition)) ?? [];
                // Verifica se a resposta foi adaptada, se foi registra o header e o codigo de status
                // Caso nao tenha sido registra o codigo de status como no_content
                if (header !== undefined && data !== undefined) {
                    res.setHeader(header);
                    res.setStatusCode(http_status_enum_1.HttpStatus.OK);
                }
                else {
                    res.setStatusCode(http_status_enum_1.HttpStatus.NO_CONTENT);
                }
                // Envia a resposta
                res.sendResponse(data);
            }
            catch (e) {
                this.routeException(res, e);
            }
        }
        else {
            this.routeException(res, new http_exception_1.HttpException(http_status_enum_1.HttpStatus.NOT_FOUND));
        }
    }
    // Metodo que cuida das exceções da rota
    routeException(res, e) {
        if (e instanceof http_exception_1.HttpException) {
            // Adapta a mensagem para a resposta
            const [header, data] = response_data_helper_1.ResponseDataHelper.adaptResponse(e.message) ?? [];
            // Se a mensagem foi adaptada registra o header do tipo dela
            if (header !== undefined && data !== undefined) {
                res.setHeader(header);
            }
            // Registra o codigo de status e envia a resposta
            res.setStatusCode(e.status);
            res.sendResponse(data);
        }
        else {
            // Registra como erro interno e envia uma resposta vazia
            res.setStatusCode(http_status_enum_1.HttpStatus.INTERNAL_SERVER_ERROR);
            res.sendResponse();
        }
    }
    findRoute(controllers, path, httpMethod) {
        const key = `${httpMethod}:${path}`;
        if (this.routeCache.has(key)) {
            return this.routeCache.get(key);
        }
        for (const controller of controllers) {
            for (const route of controller.routesDefinition) {
                // Verifica se a rota é compatível com o caminho e método fornecido
                if (route.forThis(path, httpMethod)) {
                    // Armazena no cache somente se a rota combina
                    this.routeCache.set(key, [controller, route]);
                    return [controller, route];
                }
            }
        }
        return undefined;
    }
}
exports.RouteManager = RouteManager;
