import http from "http";
import { Header, HeaderValue } from "../types/header";
import { HttpStatus } from "../types/http_status.enum";

export class HydraResponse {
    readonly res: http.ServerResponse;
    
    constructor(res: http.ServerResponse) {
        this.res = res;
    }

    setHeaders(headers: Record<string, HeaderValue>) {
        for (const [name, value] of Object.entries(headers)) {
            this.res.setHeader(name, value);
        }
    }

    getHeaders() {
        return this.res.getHeaders();
    }

    setHeader(header: Header) {
        this.res.setHeader(header.name, header.value);
    }

    getHeader(name: string) {
        return this.res.getHeader(name);
    }

    setStatusCode(status: HttpStatus) {
        this.res.statusCode = status;
    }

    sendResponse(contentValue?: string) {
        this.res.end(contentValue);
    }
}