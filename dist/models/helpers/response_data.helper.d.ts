import { Header } from "../../types/header";
export declare class ResponseDataHelper {
    private constructor();
    static adaptResponse(data: any): [Header, string] | undefined;
}
