"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteManager = void 0;
const handler_helper_1 = require("../helpers/handler.helper");
const response_data_helper_1 = require("../helpers/response_data.helper");
const http_status_enum_1 = require("../types/http_status.enum");
class RouteManager {
    // Metodo para manipular a rota
    async manageRoute(context, appDefinition) {
        // Busca pelo controlador e a rota requerida
        const [controller, route] = this.findRoute(context, appDefinition) ?? [];
        // Verifica se a rota foi encontrada
        // Se foi continua o fluxo normal
        // Se não retorna que não foi encontrado
        if (controller && route) {
            // Constroi os parametros dos handlers
            const parameters = handler_helper_1.HandlerHelper.buildParameters(context);
            // Executa o handler da rota
            const result = await route.runHandler(parameters);
            // Prepara a resposta para enviar
            const [header, data] = response_data_helper_1.ResponseDataHelper.adaptResponse(result) ?? [];
            // Prepara o cabeçalho da resposta
            if (header) {
                context.res.setHeader(header);
                context.res.setStatusCode(http_status_enum_1.HttpStatus.OK);
            }
            else {
                context.res.setStatusCode(http_status_enum_1.HttpStatus.NO_CONTENT);
            }
            // Envia a resposta
            context.res.sendResponse(data);
        }
        else {
            // Informa que a rota não foi encontrada
            context.res.setStatusCode(http_status_enum_1.HttpStatus.NOT_FOUND);
            context.res.sendResponse();
        }
    }
    // Metodo para buscar a rota
    findRoute(context, appDefinition) {
        return appDefinition.findControllerAndRoute(context);
    }
}
exports.RouteManager = RouteManager;
