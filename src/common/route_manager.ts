import { HydraRequest } from "./hydra_request";
import { HydraResponse } from "./hydra_response";
import { HttpException } from "../core/exceptions/http.exception";
import { HttpMethod } from "../core/types/http_method.enum";
import { HttpStatus } from "../core/types/http_status.enum";
import { ResponseDataHelper } from "../helpers/response_data.helper";
import { ControllerDefinition } from "../core/definitions/controller.definition";
import { RouteDefinition } from "../core/definitions/route.definition";
import { HandlerHelper } from "../helpers/route.helper";
import { Context } from "./context";

export class RouteManager {
    protected routeCache: Map<string, [ControllerDefinition, RouteDefinition]> = new Map();

    // Metodo para manipular a rota
    async routeHandler(req: HydraRequest, res: HydraResponse, controllers: ControllerDefinition[]): Promise<void> {
        // Procura a rota referente a requisição
        const [controller, routeDefinition] = this.findRoute(controllers, req.url.pathname, req.httpMethod) ?? [];
        // Se ela for encontrada executa o manipulador proprio dela
        // Caso contrario gera uma exceção http de status NOT FOUND
        if(controller && routeDefinition) {
            try {
                // Constroi o contexto
                const context = new Context({
                    req: req,
                    res: res,
                    route: routeDefinition,
                });

                // Constroi a lista de argumentos que os handlers vão usar
                const args = HandlerHelper.buildArgs(context);

                // Executa os middlewares que devem ser executados antes do handler da rota
                for(const middlewareDefinition of routeDefinition.beforeHandlerMiddlewares) {
                    await middlewareDefinition.runHandler(args);
                }
                
                // Chama o handler da rota
                const result = await routeDefinition.runHandler(args);

                // Salva o resultado no contexto para que seja possivel dos middlewares alterarem se necessario
                context.saveData(routeDefinition, result);
                
                // Executa os middlewares que devem ser executados depois do handler da rota
                for(const middlewareDefinition of routeDefinition.afterHandlerMiddlewares) {
                    await middlewareDefinition.runHandler(args);
                }

                // Adapta o resultado para a resposta
                const [header, data] = ResponseDataHelper.adaptResponse(context.getData(routeDefinition)) ??  [];

                // Verifica se a resposta foi adaptada, se foi registra o header e o codigo de status
                // Caso nao tenha sido registra o codigo de status como no_content
                if(header !== undefined && data !== undefined) {
                    res.setHeader(header);
                    res.setStatusCode(HttpStatus.OK);
                }else {
                    res.setStatusCode(HttpStatus.NO_CONTENT);
                }

                // Envia a resposta
                res.sendResponse(data);
            }catch(e) {
                this.routeException(res, e);
            }
        }else {
            this.routeException(res, new HttpException(HttpStatus.NOT_FOUND));
        }
    }

    // Metodo que cuida das exceções da rota
    protected routeException(res: HydraResponse, e: any) {
        if(e instanceof HttpException) {
            // Adapta a mensagem para a resposta
            const [header, data] = ResponseDataHelper.adaptResponse(e.message) ?? [];

            // Se a mensagem foi adaptada registra o header do tipo dela
            if(header !== undefined && data !== undefined) {
                res.setHeader(header);
            }

            // Registra o codigo de status e envia a resposta
            res.setStatusCode(e.status);
            res.sendResponse(data);
        }else {
            // Registra como erro interno e envia uma resposta vazia
            res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
            res.sendResponse();
        }
    }

    protected findRoute(controllers: ControllerDefinition[], path: string, httpMethod: HttpMethod): [ControllerDefinition, RouteDefinition] | undefined {
        const key = `${httpMethod}:${path}`;

        if(this.routeCache.has(key)) {
            return this.routeCache.get(key)!;
        }

        for(const controller of controllers) {
            for(const route of controller.routesDefinition) {
                // Verifica se a rota é compatível com o caminho e método fornecido
                if(route.forThis(path, httpMethod)) {
                    // Armazena no cache somente se a rota combina
                    this.routeCache.set(key, [controller, route]);
                    return [controller, route];
                }
            }
        }

        return undefined;
    }
}