export declare class Hydra {
    private readonly appDefinition;
    private readonly server;
    private isRunning;
    private constructor();
    startServer(): Promise<void>;
    stopServer(): Promise<void>;
    private onRequest;
    private getBody;
    static create(app: any): Hydra;
}
