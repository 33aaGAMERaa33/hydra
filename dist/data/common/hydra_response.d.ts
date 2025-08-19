import http from "http";
import { Header, HeaderValue } from "../types/header";
import { HttpStatus } from "../types/http_status.enum";
export declare class HydraResponse {
    readonly res: http.ServerResponse;
    constructor(res: http.ServerResponse);
    setHeaders(headers: Record<string, HeaderValue>): void;
    getHeaders(): http.OutgoingHttpHeaders;
    setHeader(header: Header): void;
    getHeader(name: string): string | number | string[] | undefined;
    setStatusCode(status: HttpStatus): void;
    sendResponse(contentValue?: string): void;
}
