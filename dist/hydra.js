"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydra = void 0;
const http_1 = __importDefault(require("http"));
const app_metadata_1 = require("./data/metadatas/app.metadata");
const original_constructor_metadata_1 = require("./data/metadatas/original_constructor.metadata");
const context_1 = require("./data/common/context");
const hydra_request_1 = require("./data/common/hydra_request");
const hydra_response_1 = require("./data/common/hydra_response");
class Hydra {
    appDefinition;
    server;
    isRunning = false;
    constructor(appConfig, server) {
        this.appDefinition = appConfig;
        this.server = server;
    }
    // Metodo para iniciar o servidor
    // Se o servidor já tiver sido iniciado ira gerar um erro
    async startServer() {
        // Verifica se o servidor já foi iniciado
        // Se foi gera um erro
        if (this.isRunning)
            throw new Error("Servidor já está rodando");
        // Registra o handler da requisição
        this.server.on("request", this.onRequest.bind(this));
        // Começa a escutar na porta requisitada
        this.server.listen(this.appDefinition.port, () => {
            this.isRunning = true;
        });
    }
    // Metodo para fechar o servidor
    async stopServer() {
        // Verifica se está rodando
        // Se tiver fecha o servidor
        if (this.isRunning)
            this.server.close();
        this.isRunning = false;
    }
    getPort() {
        return this.appDefinition.port;
    }
    // handler da requisição do servidor
    async onRequest(req, res) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        ;
        const method = req.method;
        // Verifica se tem algum dado faltando
        // Se tiver ignora a requisição
        if (!url.pathname || !method)
            return;
        // Constroi as propriedades para inserir em HydraRequest
        const body = await this.getBody(req);
        const query = url.searchParams;
        // Constroi o contexto da requisição
        const context = new context_1.Context({
            req: new hydra_request_1.HydraRequest({
                url: url,
                req: req,
                body: body,
                query: query,
                method: method,
            }),
            res: new hydra_response_1.HydraResponse(res),
        });
        // Chama o manipulador de rotas para cuidar do resto da requisição
        this.appDefinition.routeManager.manageRoute(context, this.appDefinition);
    }
    // Metodo para pegar o corpo da requisiçao
    getBody(req) {
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
                }
                catch (_) {
                    resolve(body);
                }
            });
        });
    }
    static create(app) {
        // Tenta pegar o construtor da instancia
        const appConstructor = Object.getPrototypeOf(app).constructor;
        // Pega os metadados
        const isAppConfig = Reflect.getMetadata(app_metadata_1.APP_METADATA, appConstructor);
        const originalConstructor = Reflect.getMetadata(original_constructor_metadata_1.ORIGINAL_CONSTRUCTOR_METADATA, appConstructor);
        // Verifica se a instancia é um AppConfig e se o construtor original foi perdido
        // Caso alguma falhar um erro será gerado
        if (!isAppConfig || !originalConstructor)
            throw new Error("A instancia fornecida não é uma configuração de app");
        // Pega a definição da aplicação que está guardada na instancia via metadados
        const appDefinition = Reflect.getMetadata(app_metadata_1.APP_METADATA, app);
        // Prepara o servidor
        const server = http_1.default.createServer();
        // Instancia e retorna o manipulador do servidor
        return new Hydra(appDefinition, server);
    }
}
exports.Hydra = Hydra;
