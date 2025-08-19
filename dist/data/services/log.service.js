"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogService = void 0;
const chalk_1 = __importDefault(require("chalk"));
class LogService {
    static logIsActive = true;
    static debugMode = true;
    constructor() {
    }
    static log(log, onlyInDebug = false) {
        if (!this.logIsActive || (!this.debugMode && onlyInDebug))
            return;
        console.log(`${chalk_1.default.blueBright("[LOG]")} ${log}`);
    }
    static alert(log, onlyInDebug = false) {
        if (!this.logIsActive || (!this.debugMode && onlyInDebug))
            return;
        console.log(`${chalk_1.default.yellowBright("[ALERT]")} ${log}`);
    }
    static error(log, onlyInDebug = false) {
        if (!this.logIsActive || (!this.debugMode && onlyInDebug))
            return;
        console.log(`${chalk_1.default.redBright("[ERROR]")} ${log}`);
    }
}
exports.LogService = LogService;
