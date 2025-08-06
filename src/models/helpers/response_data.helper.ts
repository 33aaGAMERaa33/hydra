import { Header, HeaderValue } from "../../types/header";
import fs from "fs";

export class ResponseDataHelper {
    private constructor() {

    }

    static adaptResponse(data: any): [Header, string] | undefined {
        switch(typeof data) {
            case "object":
                try {
                    return [
                        {name: "content-type", value: "application/json"},
                        JSON.stringify(data),
                    ];
                }catch (_){}
            case "string":
                if(data.trim().startsWith("<!DOCTYPE html>") || data.trim().startsWith("<html>")) {
                    return [
                        {name: "content-type", value: "text/html"},
                        String(data).trim(),
                    ];
                }
            case "number":
            case "bigint":
            case "boolean":
            case "symbol":
                return [
                    {name: "content-type", value: "text/plain"},
                    String(data).trim()
                ];
            case "function":
                throw new Error("Não é possivel enviar uma função como resposta");
            case "undefined":
                return undefined;
        }
    }
}