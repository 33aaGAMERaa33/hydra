import { AppDefinition } from "./data/definitions/app.definition";
import http from "http";
import { HttpMethod } from "./data/enums/http_method.enum";
import { APP_METADATA } from "./data/metadatas/app.metadata";
import { ORIGINAL_CONSTRUCTOR_METADATA } from "./data/metadatas/original_constructor.metadata";
import { Context } from "./data/common/context";
import { HydraRequest } from "./data/common/hydra_request";
import { HydraResponse } from "./data/common/hydra_response";

export class Hydra {
    private readonly appDefinition: AppDefinition;
    private readonly server: http.Server;
    private isRunning: boolean = false;

    private constructor(appConfig: AppDefinition, server: http.Server) {
        this.appDefinition = appConfig;
        this.server = server;
    }

    // Metodo para iniciar o servidor
    // Se o servidor já tiver sido iniciado ira gerar um erro
    async startServer(): Promise<void> {
        // Verifica se o servidor já foi iniciado
        // Se foi gera um erro
        if(this.isRunning) throw new Error("Servidor já está rodando");
        // Registra o handler da requisição
        this.server.on("request", this.onRequest.bind(this));
        // Começa a escutar na porta requisitada
        this.server.listen(this.appDefinition.port, () => {
            this.isRunning = true;
        });
    }
    // Metodo para fechar o servidor
    async stopServer(): Promise<void> {
        // Verifica se está rodando
        // Se tiver fecha o servidor
        if(this.isRunning) this.server.close();
        this.isRunning = false;
    }

    getPort(): number {
        return this.appDefinition.port;
    }

    // handler da requisição do servidor
    private async onRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        const url = new URL(req.url!, `http://${req.headers.host}`);;
        const method: HttpMethod | undefined = req.method as HttpMethod;

        // Verifica se tem algum dado faltando
        // Se tiver ignora a requisição
        if(!url.pathname || !method) return;

        // Constroi as propriedades para inserir em HydraRequest
        const body = await this.getBody(req);
        const query = url.searchParams;

        // Constroi o contexto da requisição
        const context = new Context({
            req: new HydraRequest({
                url: url,
                req: req,
                body: body,
                query: query,
                method: method,
            }),
            res: new HydraResponse(res), 
        });

        // Chama o manipulador de rotas para cuidar do resto da requisição
        this.appDefinition.routeManager.manageRoute(context, this.appDefinition);
    }

    // Metodo para pegar o corpo da requisiçao
    private getBody(req: http.IncomingMessage): Promise<any> {
        // Retorna uma promise que finaliza assim que os dados da requisição terminar 
        return new Promise((resolve) => {
            // Varivel que guarda os dados que chegar
            let body = "";
            // Espera os dados chegar e incluem no body
            req.on("data", (chunk) => {
                const string = new String(chunk);
                body += string;
            });

            // Assim que fechar tenta retornar um json, se der errado retorna a string
            req.once("end", () => {
                try {
                    resolve(JSON.parse(body));
                }catch(_) {
                    resolve(body);
                }
            });
        });
    }

    static create(app: any): Hydra {
        // Tenta pegar o construtor da instancia
        const appConstructor = Object.getPrototypeOf(app).constructor;
        // Pega os metadados
        const isAppConfig = Reflect.getMetadata(APP_METADATA, appConstructor);
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA, appConstructor);

        // Verifica se a instancia é um AppConfig e se o construtor original foi perdido
        // Caso alguma falhar um erro será gerado
        if(!isAppConfig || !originalConstructor) throw new Error("A instancia fornecida não é uma configuração de app");

        // Pega a definição da aplicação que está guardada na instancia via metadados
        const appDefinition: AppDefinition = Reflect.getMetadata(APP_METADATA, app);

        // Prepara o servidor
        const server = http.createServer();

        // Instancia e retorna o manipulador do servidor
        return new Hydra(appDefinition, server);
    }
} 