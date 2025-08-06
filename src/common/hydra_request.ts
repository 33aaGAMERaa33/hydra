import http from "http";
import { HttpMethod } from "../types/http_method.enum";

export class HydraRequest {
    readonly url: URL;
    readonly body: any;
    readonly httpMethod: HttpMethod;
    readonly query: URLSearchParams;

    private readonly req: http.IncomingMessage;

    constructor(data: {
        req: http.IncomingMessage;
        url: URL; 
        body: any;
        httpMethod: HttpMethod;
        query: URLSearchParams;
    }) {
        this.req = data.req;
        this.url = data.url;
        this.body = data.body;
        this.httpMethod = data.httpMethod;
        this.query = data.query;
    }

    get headers(): http.IncomingHttpHeaders {
        return this.req.headers;
    }
}