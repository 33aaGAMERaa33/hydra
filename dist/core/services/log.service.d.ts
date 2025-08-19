export declare class LogService {
    private static readonly logIsActive;
    private static readonly debugMode;
    private constructor();
    static log(log: Object, onlyInDebug?: boolean): void;
    static alert(log: Object, onlyInDebug?: boolean): void;
    static error(log: Object, onlyInDebug?: boolean): void;
}
