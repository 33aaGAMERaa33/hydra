export declare class Hydra {
    private readonly appConfig;
    private readonly server;
    private isRunning;
    private constructor();
    startServer(): Promise<void>;
    stopServer(): Promise<void>;
    private onRequest;
    private getBody;
    static create(app: any): Hydra;
}
