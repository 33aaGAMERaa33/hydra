import { AppDefinition } from "../definitions/app.definition";
import { ControllerDefinition } from "../definitions/controller.definition";
import { RouteDefinition } from "../definitions/route.definition";
import { HandlerHelper } from "../helpers/handler.helper";
import { ResponseDataHelper } from "../helpers/response_data.helper";
import { HttpStatus } from "../types/http_status.enum";
import { Context } from "./context";

export class RouteManager {
    constructor(controllers: ControllerDefinition[]) {

    }

    // Metodo para manipular a rota
    async manageRoute(context: Context, appDefinition: AppDefinition) {
        // Busca pelo controlador e a rota requerida
        const [controller, route] = this.findRoute(context, appDefinition) ?? [];

        // Verifica se a rota foi encontrada
        // Se foi continua o fluxo normal
        // Se não retorna que não foi encontrado
        if(controller && route) {
            // Constroi os parametros dos handlers
            const parameters = HandlerHelper.buildParameters(context);
            // Executa o handler da rota
            const result = await route.runHandler(parameters);   

            // Prepara a resposta para enviar
            const [header, data] = ResponseDataHelper.adaptResponse(result) ?? [];

            // Prepara o cabeçalho da resposta
            if(header) {
                context.res.setHeader(header);
                context.res.setStatusCode(HttpStatus.OK);
            }else {
                context.res.setStatusCode(HttpStatus.NO_CONTENT);
            }

            // Envia a resposta
            context.res.sendResponse(data);
        }else {
            // Informa que a rota não foi encontrada
            context.res.setStatusCode(HttpStatus.NOT_FOUND);
            context.res.sendResponse();
        }
    }

    // Metodo para buscar a rota
    protected findRoute(context: Context, appDefinition: AppDefinition): [ControllerDefinition, RouteDefinition] | undefined {
        return undefined;
    }
}