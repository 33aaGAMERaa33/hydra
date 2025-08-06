import { HttpStatus } from "../types/http_status.enum";

export class HttpException {
    readonly status: HttpStatus;
    readonly error?: Object;
    readonly message: any;

    constructor(status: HttpStatus, message?: any, error?: Object) {
        this.status = status;
        this.message = message;
        this.error = error;
    }
}