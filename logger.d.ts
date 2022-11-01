interface LogMessage {
    id: number;
    message: string;
    type: "info" | "warn" | "error";
    timestamp: number;
    datetime: string;
    userDefinedAttrs: Record<string, any>;
}
interface LogError extends LogMessage {
    type: "error";
    trace: string[];
    resolved: boolean;
    errorCode: number;
}
interface LogWarning extends LogMessage {
    type: "warn";
}
interface LogInfo extends LogMessage {
    type: "info";
}
declare type Log = LogError | LogWarning | LogInfo;
export default class QueryableLogger {
    logs: Log[];
    emptyLog: Log;
    userDefinedAttrs: Record<string, any>;
    loggerOptions: Record<string, boolean | string>;
    constructor(userDefinedAttrs?: string[], enablePrint?: boolean);
    setDisplayLogs(object: Record<string, boolean>): void;
    getLogs(): Log[];
    getErrors(): Log[];
    getWarnings(): Log[];
    getInfo(): Log[];
    log(message: string, ...args: Record<string, any>[]): Log;
    info(message: string, ...args: Record<string, any>[]): Log;
    warn(message: string, ...args: Record<string, any>[]): Log;
    error(message: string, trace?: string[], errorCode?: number, ...args: Record<string, any>[]): Log;
    getLog(id: number): Log;
    resolveError(id: number): Log;
    resolveAllErrors(): Log[];
    clearLogs(): void;
    clearErrors(): void;
    clearWarnings(): void;
    clearInfo(): void;
    displayLogs(): void;
    displayErrors(): void;
    displayWarnings(): void;
    displayInfo(): void;
    downloadJSON(): void;
    getJSON(): string;
    getCSV: (logs?: Log[]) => string;
    downloadCSV: (logs?: Log[]) => void;
    overrideLogs(logs: Log[]): void;
    saveToLocalStore(): number;
    static loadFromLocalStore(id: number): QueryableLogger;
    static clearLocalStore(id?: number): void;
    select(columns?: string[]): LoggerQueryContainer;
    static from(selected: Log[], type?: string): Log[];
    static where(selected: Log[], key: string, value: (string | number)[]): Log[];
}
declare class LoggerQueryContainer {
    logs: Log[];
    columns: string[];
    constructor(logs?: Log[], columns?: string[]);
    from(type?: string): this;
    where(key: string, value: (string | number)[]): this;
    get(): any;
}
export {};
