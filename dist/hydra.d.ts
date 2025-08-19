export declare class Hydra {
    private readonly appDefinition;
    private readonly server;
    private isRunning;
    private constructor();
    startServer(): Promise<void>;
    stopServer(): Promise<void>;
    getPort(): number;
    private onRequest;
    private getBody;
    static create(app: any): Hydra;
}
