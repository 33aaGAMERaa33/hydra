import http from "http";
import { HttpMethod } from "../core/types/http_method.enum";
export declare class HydraRequest {
    readonly url: URL;
    readonly body: any;
    readonly httpMethod: HttpMethod;
    readonly query: URLSearchParams;
    private readonly req;
    constructor(data: {
        req: http.IncomingMessage;
        url: URL;
        body: any;
        httpMethod: HttpMethod;
        query: URLSearchParams;
    });
    get headers(): http.IncomingHttpHeaders;
}
