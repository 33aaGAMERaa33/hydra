import { AppConfigImplicitImpl } from "./interfaces/app_config_implicit.impl";
import { APP_CONFIG_METADATA_KEY } from "./metadata_key/app_config.metadata_key";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "./metadata_key/original_constructor.metadata_key";
import { HttpMethod } from "./types/http_method.enum";
import { HydraRequest } from "./common/hydra_request";
import { HydraResponse } from "./common/hydra_response";
import http from "http";

export class Hydra {
    private readonly appConfig: AppConfigImplicitImpl;
    private readonly server: http.Server;
    private isRunning: boolean = false;

    private constructor(appConfig: AppConfigImplicitImpl, server: http.Server) {
        this.appConfig = appConfig;
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
        this.server.listen(this.appConfig.__port, () => {
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

    // handler da requisição do servidor
    private async onRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        const url = new URL(req.url!, `http://${req.headers.host}`);;
        const httpMethod: HttpMethod | undefined = req.method as HttpMethod;

        // Verifica se tem algum dado faltando
        // Se tiver ignora a requisição
        if(!url.pathname || !httpMethod) return;

        // Constroi as propriedades para inserir em HydraRequest
        const body = await this.getBody(req);
        const query = url.searchParams;

        // Converte os dados da requisição e prepara uma classe para manipular a resposta
        const hydraRequest = new HydraRequest({
            req: req,
            url: url,
            body: body,
            query: query,
            httpMethod: httpMethod,
        });
        // Constroi o manipulador da resposta
        const hydraResponse = new HydraResponse(res);

        // Chama o manipulador de rota
        // Apartir daqui ele cuida do resto da requisição
        this.appConfig.__routeManager.routeHandler(hydraRequest, hydraResponse, this.appConfig.__controllers, this.appConfig.__middlewares);
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
        const isAppConfig = Reflect.getMetadata(APP_CONFIG_METADATA_KEY, appConstructor);
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, appConstructor);

        // Verifica se a instancia é um AppConfig e se o construtor original foi perdido
        // Caso alguma falhar um erro será gerado
        if(!isAppConfig || !originalConstructor) throw new Error("A instancia fornecida não é uma configuração de app");

        // Se for AppConfig e o construtor original não for perdido, então a instancia implementa AppConfigImplicitImpl de forma implicita
        const appConfigInstance = app as AppConfigImplicitImpl;

        // Prepara o servidor
        const server = http.createServer();

        // Instancia e retrna o manipulador do servidor
        return new Hydra(appConfigInstance, server);
    }
} 