import { Header } from "../core/types/header";
export declare class ResponseDataHelper {
    private constructor();
    static adaptResponse(data: any): [Header, string] | undefined;
}
