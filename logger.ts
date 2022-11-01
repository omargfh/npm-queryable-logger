// Loggers
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

type Log = LogError | LogWarning | LogInfo;
export default class QueryableLogger {
    logs: Log[] = [];
    emptyLog: Log = {
        id: 0,
        message: "Logger initialized",
        type: "info",
        timestamp: Date.now(),
        datetime: new Date().toISOString(),
        userDefinedAttrs: {}
    }
    userDefinedAttrs: Record<string, any> = {};
    loggerOptions: Record<string, boolean | string> = {
        "displayLogs": false,
        "displayErrors": false,
        "displayWarnings": false,
        "displayInfos": false,
        "displayResolvedErrors": false,
        "displayUnresolvedErrors": false,
    }
    constructor(userDefinedAttrs?: string[], enablePrint: boolean = false) {
        this.logs = [this.emptyLog];
        if (enablePrint) {
            this.setDisplayLogs({
                "displayLogs": true,
                "displayErrors": true,
                "displayWarnings": true,
                "displayInfos": true,
                "displayResolvedErrors": true,
                "displayUnresolvedErrors": true,
            });
        }
        if (!userDefinedAttrs) {
            return;
        }
        this.userDefinedAttrs = userDefinedAttrs.map((e : string) => { return {[e]: null} });
    }
    setDisplayLogs(object: Record<string, boolean>) {
        Object.keys(object).forEach((key) => {
            if (this.loggerOptions[key]) {
                this.loggerOptions[key] = object[key];
            }
        });
    }

    getLogs() {
        return this.logs;
    }
    getErrors() {
        return this.logs.filter((log) => log.type === "error");
    }
    getWarnings() {
        return this.logs.filter((log) => log.type === "warn");
    }
    getInfo() {
        return this.logs.filter((log) => log.type === "info");
    }
    log(message: string, ...args: Record<string, any>[]) {
        this.logs.push({
            id: this.logs[this.logs.length - 1].id + 1,
            message,
            type: "info",
            timestamp: Date.now(),
            datetime: new Date().toISOString(),
            userDefinedAttrs: args.reduce((acc, cur) => this.userDefinedAttrs[cur.key] && ({...acc, ...cur}), {})
        });
        if (this.loggerOptions.displayLogs) {
            console.log(message);
        }
        return this.logs[this.logs.length - 1];
    }
    info(message: string, ...args: Record<string, any>[]) {
        return this.log(message, ...args);
    }
    warn(message: string, ...args: Record<string, any>[]) {
        this.logs.push({
            id: this.logs[this.logs.length - 1].id + 1,
            message,
            type: "warn",
            timestamp: Date.now(),
            datetime: new Date().toISOString(),
            userDefinedAttrs: args.reduce((acc, cur) => this.userDefinedAttrs[cur.key] && ({...acc, ...cur}), {})

        });
        if (this.loggerOptions.displayWarnings) {
            console.warn(message);
        }
        return this.logs[this.logs.length - 1];
    }

    error(message: string, trace: string[] = [], errorCode: number = 400, ...args: Record<string, any>[]) {
        this.logs.push({
            id: this.logs[this.logs.length - 1].id + 1,
            message,
            type: "error",
            timestamp: Date.now(),
            datetime: new Date().toISOString(),
            trace,
            resolved: false,
            errorCode,
            userDefinedAttrs: args.reduce((acc, cur) => this.userDefinedAttrs[cur.key] && ({...acc, ...cur}), {})
        });
        if (this.loggerOptions.displayErrors) {
            console.error(message);
        }
        return this.logs[this.logs.length - 1];
    }

    getLog(id: number) {
        const found: Log | undefined = this.logs.find((log) => log.id === id);
        if (found) {
            return found;
        }
        console.error("Log not found");
        return this.emptyLog;
    }

    resolveError(id: number) {
        const error = this.logs.find((log) => log.id === id);
        if (error && error.type === "error") {
            error.resolved = true;
        }
        if (this.loggerOptions.displayResolvedErrors) {
            console.log(error);
        }
        return error;
    }

    resolveAllErrors() {
        this.getErrors().forEach((log) => log.type === 'error' && (log.resolved = true));
        return this.logs;
    }

    clearLogs() {
        this.logs = [this.emptyLog];
    }

    clearErrors() {
        this.logs = this.logs.filter((log) => log.type !== "error");
    }

    clearWarnings() {
        this.logs = this.logs.filter((log) => log.type !== "warn");
    }

    clearInfo() {
        this.logs = this.logs.filter((log) => log.type !== "info");
    }

    displayLogs() {
        console.table(this.logs);
    }

    displayErrors() {
        console.table(this.getErrors());
    }

    displayWarnings() {
        console.table(this.getWarnings());
    }

    displayInfo() {
        console.table(this.getInfo());
    }

    downloadJSON() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.logs));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "log.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    getJSON() {
        return JSON.stringify(this.logs);
    }

    getCSV = (logs: Log[] = this.logs) => {
        let csv = "id, message, type, timestamp, datetime, userDefinedAttrs";
        logs.forEach((log) => {
            csv += `${log.id}, ${log.message}, ${log.type}, ${log.timestamp}, ${JSON.stringify(log.userDefinedAttrs)}`;
        });
        return csv;
    }

    downloadCSV = (logs: Log[] = this.logs) => {
        const csv = this.getCSV(logs);
        const blob = new Blob([csv], {type: "text/csv"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.setAttribute("href", url);
        a.setAttribute("download", "logs.csv");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    overrideLogs(logs: Log[]) {
        this.logs = logs;
    }

    saveToLocalStore() {
        const id: number = Math.floor(Math.random() * 100000000000000000);
        localStorage.setItem("QueryableLoggerNPM-" + id, JSON.stringify({
            id,
            "log": this.logs
        }));
        return id;
    }

    static loadFromLocalStore(id: number) {
        const logs = JSON.parse(localStorage.getItem("QueryableLoggerNPM-" + id) || "{}");
        if (logs && logs.log) {
            const logger = new QueryableLogger([]);
            logger.overrideLogs(logs.log);
            return logger;
        }
        return null;
    }

    static clearLocalStore(id?: number) {
        if (id) {
            localStorage.removeItem("QueryableLoggerNPM-" + id);
            return;
        }
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("QueryableLoggerNPM-")) {
                localStorage.removeItem(key);
            }
        });
    }

    select(columns: string[] = ['id', 'message', 'type', 'timestamp', 'userDefinedAttrs']) {
        return new LoggerQueryContainer(this.logs, columns);
    }
    static from(selected: Log[], type = "all" || "error" || "warn" || "log") {
        return selected.filter((log) => log.type === type);
    }
    static where(selected: Log[], key: string, value: (string | number)[]) {
        // determine if key is user defined attribute
        const isUserDefinedAttr = selected[0].userDefinedAttrs && selected[0].userDefinedAttrs[key];
        // value looks like ["=", "john doe"]
        if (value[0] === "=") {
            return selected.filter((log) => {
                if (isUserDefinedAttr) {
                    return log.userDefinedAttrs[key] === value[1];
                }
                return log[key] === value[1];
            });
        }
        else if (value[0] === "!=") {
            return selected.filter((log) => {
                if (isUserDefinedAttr) {
                    return log.userDefinedAttrs[key] !== value[1];
                }
                return log[key] !== value[1];
            });
        }
        else if (value[0] === ">") {
            return selected.filter((log) => {
                if (isUserDefinedAttr) {
                    return log.userDefinedAttrs[key] > value[1];
                }
                return log[key] > value[1];
            });
        }
        else if (value[0] === "<") {
            return selected.filter((log) => {
                if (isUserDefinedAttr) {
                    return log.userDefinedAttrs[key] < value[1];
                }
                return log[key] < value[1];
            });
        }
        else if (value[0] === ">=") {
            return selected.filter((log) => {
                if (isUserDefinedAttr) {
                    return log.userDefinedAttrs[key] >= value[1];
                }
                return log[key] >= value[1];
            });
        }
        else if (value[0] === "<=") {
            return selected.filter((log) => {
                if (isUserDefinedAttr) {
                    return log.userDefinedAttrs[key] <= value[1];
                }
                return log[key] <= value[1];
            });
        }
        else if (typeof value[1] === "string" && value[1] === "LIKE") {
            return selected.filter((log) => {
                if (isUserDefinedAttr) {
                    return log.userDefinedAttrs[key].includes(value[2]);
                }
                return log[key].includes(value[2]);
            });
        }
        else if (typeof value[1] === "string" && value[1] === "NOT LIKE") {
            return selected.filter((log) => {
                if (isUserDefinedAttr) {
                    return !log.userDefinedAttrs[key].includes(value[2]);
                }
                return !log[key].includes(value[2]);
            });
        }
        else {
            return selected;
        }
    }
}

class LoggerQueryContainer {
    logs: Log[] = [];
    columns: string[] = [];
    constructor(logs: Log[] = [], columns: string[] = ['id', 'message', 'type', 'timestamp', 'userDefinedAttrs']) {
        this.logs = logs;
        this.columns = columns;
    }

    from(type = "all" || "error" || "warn" || "log") {
        this.logs = QueryableLogger.from(this.logs, type);
        return this;
    }

    where(key: string, value: (string | number)[]) {
        this.logs = QueryableLogger.where(this.logs, key, value);
        return this;
    }

    get(): any {
        // Filter out columns not in this.columns
        return this.logs.map((log) => {
            const newLog: any = {};
            this.columns.forEach((column) => {
                if (Object.keys(log).includes(column)) {
                    newLog[column] = log[column];
                }
                else if (log.userDefinedAttrs && Object.keys(log.userDefinedAttrs).includes(column)) {
                    newLog[column] = log['userDefinedAttrs'][column];
                }
                else {
                    newLog[column] = null;
                }
            });
            return newLog;
        });
    }
}