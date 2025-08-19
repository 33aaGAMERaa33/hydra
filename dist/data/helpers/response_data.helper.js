"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseDataHelper = void 0;
class ResponseDataHelper {
    constructor() {
    }
    static adaptResponse(data) {
        switch (typeof data) {
            case "object":
                try {
                    return [
                        { name: "content-type", value: "application/json; charset=utf-8" },
                        JSON.stringify(data),
                    ];
                }
                catch (_) { }
            case "string":
                if (data.trim().startsWith("<!DOCTYPE html>") || data.trim().startsWith("<html>")) {
                    return [
                        { name: "content-type", value: "text/html; charset=utf-8" },
                        String(data).trim(),
                    ];
                }
            case "number":
            case "bigint":
            case "boolean":
            case "symbol":
                return [
                    { name: "content-type", value: "text/plain; charset=utf-8" },
                    String(data).trim()
                ];
            case "function":
                throw new Error("Não é possivel enviar uma função como resposta");
            case "undefined":
                return undefined;
        }
    }
}
exports.ResponseDataHelper = ResponseDataHelper;
