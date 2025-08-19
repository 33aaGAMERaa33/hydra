import { HttpStatus } from "../types/http_status.enum";
export declare class HttpException {
    readonly status: HttpStatus;
    readonly error?: Object;
    readonly message: any;
    constructor(status: HttpStatus, message?: any, error?: Object);
}
