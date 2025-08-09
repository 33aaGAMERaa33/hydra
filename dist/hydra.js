"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydra = void 0;
const hydra_request_1 = require("./common/hydra_request");
const hydra_response_1 = require("./common/hydra_response");
const http_1 = __importDefault(require("http"));
const app_config_metadata_key_1 = require("./core/metadata_key/app_config.metadata_key");
const original_constructor_metadata_key_1 = require("./core/metadata_key/original_constructor.metadata_key");
class Hydra {
    appConfig;
    server;
    isRunning = false;
    constructor(appConfig, server) {
        this.appConfig = appConfig;
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
        this.server.listen(this.appConfig.__port, () => {
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
    // handler da requisição do servidor
    async onRequest(req, res) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        ;
        const httpMethod = req.method;
        // Verifica se tem algum dado faltando
        // Se tiver ignora a requisição
        if (!url.pathname || !httpMethod)
            return;
        // Constroi as propriedades para inserir em HydraRequest
        const body = await this.getBody(req);
        const query = url.searchParams;
        // Converte os dados da requisição e prepara uma classe para manipular a resposta
        const hydraRequest = new hydra_request_1.HydraRequest({
            req: req,
            url: url,
            body: body,
            query: query,
            httpMethod: httpMethod,
        });
        // Constroi o manipulador da resposta
        const hydraResponse = new hydra_response_1.HydraResponse(res);
        // Chama o manipulador de rota
        // Apartir daqui ele cuida do resto da requisição
        this.appConfig.__routeManager.routeHandler(hydraRequest, hydraResponse, this.appConfig.__controllers, this.appConfig.__middlewares);
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
        const isAppConfig = Reflect.getMetadata(app_config_metadata_key_1.APP_CONFIG_METADATA_KEY, appConstructor);
        const originalConstructor = Reflect.getMetadata(original_constructor_metadata_key_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, appConstructor);
        // Verifica se a instancia é um AppConfig e se o construtor original foi perdido
        // Caso alguma falhar um erro será gerado
        if (!isAppConfig || !originalConstructor)
            throw new Error("A instancia fornecida não é uma configuração de app");
        // Se for AppConfig e o construtor original não for perdido, então a instancia implementa AppConfigImplicitImpl de forma implicita
        const appConfigInstance = app;
        // Prepara o servidor
        const server = http_1.default.createServer();
        // Instancia e retrna o manipulador do servidor
        return new Hydra(appConfigInstance, server);
    }
}
exports.Hydra = Hydra;
