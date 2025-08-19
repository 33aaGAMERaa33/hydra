import http from "http";
import { HttpMethod } from "../enums/http_method.enum";

export class HydraRequest {
    readonly url: URL;
    readonly body: any;
    readonly method: HttpMethod;
    readonly query: URLSearchParams;

    private readonly req: http.IncomingMessage;

    constructor(data: {
        req: http.IncomingMessage;
        url: URL; 
        body: any;
        method: HttpMethod;
        query: URLSearchParams;
    }) {
        this.req = data.req;
        this.url = data.url;
        this.body = data.body;
        this.method = data.method;
        this.query = data.query;
    }

    get headers(): http.IncomingHttpHeaders {
        return this.req.headers;
    }
}