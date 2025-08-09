import { AppDefinition } from "../core/definitions/app.definition";
import { ControllerDefinition } from "../core/definitions/controller.definition";
import { RouteDefinition } from "../core/definitions/route.definition";
import { HttpStatus } from "../core/types/http_status.enum";
import { HandlerHelper } from "../helpers/handler.helper";
import { ResponseDataHelper } from "../helpers/response_data.helper";
import { Context } from "./context";

export class RouteManager {
    // Metodo para manipular a rota
    async manageRoute(context: Context, appDefinition: AppDefinition) {
        // Busca pelo controlador e a rota requerida
        const [controller, route] = this.findRoute(context, appDefinition) ?? [];

        // Verifica se a rota foi encontrada
        // Se foi continua o fluxo normal
        // Se não retorna que não foi encontrado
        if(controller && route) {
            // Executa o handler da rota
            const result = await route.runHandler(HandlerHelper.buildArgs(context));    

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
        // Busca o controlador da rota pelo prefixo
        const controller = appDefinition.findController(`/${context.req.url.pathname.split("/")[1]}`);
        // Verifica se o controlador foi encontrado
        // Se não foi retorna indefinido
        if(!controller) return undefined;
        // Busca a rota 
        const route = controller.findRoute(context.req.url.pathname.replace(controller.prefix, ""), context.req.method);

        if(!route) return undefined;

        return [controller, route];
    }
}