"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var QueryableLogger = /** @class */ (function () {
    function QueryableLogger(userDefinedAttrs, enablePrint) {
        if (enablePrint === void 0) { enablePrint = false; }
        var _this = this;
        this.logs = [];
        this.emptyLog = {
            id: 0,
            message: "Logger initialized",
            type: "info",
            timestamp: Date.now(),
            datetime: new Date().toISOString(),
            userDefinedAttrs: {}
        };
        this.userDefinedAttrs = {};
        this.loggerOptions = {
            "displayLogs": false,
            "displayErrors": false,
            "displayWarnings": false,
            "displayInfos": false,
            "displayResolvedErrors": false,
            "displayUnresolvedErrors": false
        };
        this.getCSV = function (logs) {
            if (logs === void 0) { logs = _this.logs; }
            var csv = "id, message, type, timestamp, datetime, userDefinedAttrs";
            logs.forEach(function (log) {
                csv += "".concat(log.id, ", ").concat(log.message, ", ").concat(log.type, ", ").concat(log.timestamp, ", ").concat(JSON.stringify(log.userDefinedAttrs));
            });
            return csv;
        };
        this.downloadCSV = function (logs) {
            if (logs === void 0) { logs = _this.logs; }
            var csv = _this.getCSV(logs);
            var blob = new Blob([csv], { type: "text/csv" });
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.setAttribute("hidden", "");
            a.setAttribute("href", url);
            a.setAttribute("download", "logs.csv");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
        this.logs = [this.emptyLog];
        if (enablePrint) {
            this.setDisplayLogs({
                "displayLogs": true,
                "displayErrors": true,
                "displayWarnings": true,
                "displayInfos": true,
                "displayResolvedErrors": true,
                "displayUnresolvedErrors": true
            });
        }
        if (!userDefinedAttrs) {
            return;
        }
        this.userDefinedAttrs = userDefinedAttrs.map(function (e) {
            var _a;
            return _a = {}, _a[e] = null, _a;
        });
    }
    QueryableLogger.prototype.setDisplayLogs = function (object) {
        var _this = this;
        Object.keys(object).forEach(function (key) {
            if (_this.loggerOptions[key]) {
                _this.loggerOptions[key] = object[key];
            }
        });
    };
    QueryableLogger.prototype.getLogs = function () {
        return this.logs;
    };
    QueryableLogger.prototype.getErrors = function () {
        return this.logs.filter(function (log) { return log.type === "error"; });
    };
    QueryableLogger.prototype.getWarnings = function () {
        return this.logs.filter(function (log) { return log.type === "warn"; });
    };
    QueryableLogger.prototype.getInfo = function () {
        return this.logs.filter(function (log) { return log.type === "info"; });
    };
    QueryableLogger.prototype.log = function (message) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.logs.push({
            id: this.logs[this.logs.length - 1].id + 1,
            message: message,
            type: "info",
            timestamp: Date.now(),
            datetime: new Date().toISOString(),
            userDefinedAttrs: args.reduce(function (acc, cur) { return _this.userDefinedAttrs[cur.key] && (__assign(__assign({}, acc), cur)); }, {})
        });
        if (this.loggerOptions.displayLogs) {
            console.log(message);
        }
        return this.logs[this.logs.length - 1];
    };
    QueryableLogger.prototype.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.log.apply(this, __spreadArray([message], args, false));
    };
    QueryableLogger.prototype.warn = function (message) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.logs.push({
            id: this.logs[this.logs.length - 1].id + 1,
            message: message,
            type: "warn",
            timestamp: Date.now(),
            datetime: new Date().toISOString(),
            userDefinedAttrs: args.reduce(function (acc, cur) { return _this.userDefinedAttrs[cur.key] && (__assign(__assign({}, acc), cur)); }, {})
        });
        if (this.loggerOptions.displayWarnings) {
            console.warn(message);
        }
        return this.logs[this.logs.length - 1];
    };
    QueryableLogger.prototype.error = function (message, trace, errorCode) {
        var _this = this;
        if (trace === void 0) { trace = []; }
        if (errorCode === void 0) { errorCode = 400; }
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        this.logs.push({
            id: this.logs[this.logs.length - 1].id + 1,
            message: message,
            type: "error",
            timestamp: Date.now(),
            datetime: new Date().toISOString(),
            trace: trace,
            resolved: false,
            errorCode: errorCode,
            userDefinedAttrs: args.reduce(function (acc, cur) { return _this.userDefinedAttrs[cur.key] && (__assign(__assign({}, acc), cur)); }, {})
        });
        if (this.loggerOptions.displayErrors) {
            console.error(message);
        }
        return this.logs[this.logs.length - 1];
    };
    QueryableLogger.prototype.getLog = function (id) {
        var found = this.logs.find(function (log) { return log.id === id; });
        if (found) {
            return found;
        }
        console.error("Log not found");
        return this.emptyLog;
    };
    QueryableLogger.prototype.resolveError = function (id) {
        var error = this.logs.find(function (log) { return log.id === id; });
        if (error && error.type === "error") {
            error.resolved = true;
        }
        if (this.loggerOptions.displayResolvedErrors) {
            console.log(error);
        }
        return error;
    };
    QueryableLogger.prototype.resolveAllErrors = function () {
        this.getErrors().forEach(function (log) { return log.type === 'error' && (log.resolved = true); });
        return this.logs;
    };
    QueryableLogger.prototype.clearLogs = function () {
        this.logs = [this.emptyLog];
    };
    QueryableLogger.prototype.clearErrors = function () {
        this.logs = this.logs.filter(function (log) { return log.type !== "error"; });
    };
    QueryableLogger.prototype.clearWarnings = function () {
        this.logs = this.logs.filter(function (log) { return log.type !== "warn"; });
    };
    QueryableLogger.prototype.clearInfo = function () {
        this.logs = this.logs.filter(function (log) { return log.type !== "info"; });
    };
    QueryableLogger.prototype.displayLogs = function () {
        console.table(this.logs);
    };
    QueryableLogger.prototype.displayErrors = function () {
        console.table(this.getErrors());
    };
    QueryableLogger.prototype.displayWarnings = function () {
        console.table(this.getWarnings());
    };
    QueryableLogger.prototype.displayInfo = function () {
        console.table(this.getInfo());
    };
    QueryableLogger.prototype.downloadJSON = function () {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.logs));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "log.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };
    QueryableLogger.prototype.getJSON = function () {
        return JSON.stringify(this.logs);
    };
    QueryableLogger.prototype.overrideLogs = function (logs) {
        this.logs = logs;
    };
    QueryableLogger.prototype.saveToLocalStore = function () {
        var id = Math.floor(Math.random() * 100000000000000000);
        localStorage.setItem("QueryableLoggerNPM-" + id, JSON.stringify({
            id: id,
            "log": this.logs
        }));
        return id;
    };
    QueryableLogger.loadFromLocalStore = function (id) {
        var logs = JSON.parse(localStorage.getItem("QueryableLoggerNPM-" + id) || "{}");
        if (logs && logs.log) {
            var logger = new QueryableLogger([]);
            logger.overrideLogs(logs.log);
            return logger;
        }
        return null;
    };
    QueryableLogger.clearLocalStore = function (id) {
        if (id) {
            localStorage.removeItem("QueryableLoggerNPM-" + id);
            return;
        }
        Object.keys(localStorage).forEach(function (key) {
            if (key.startsWith("QueryableLoggerNPM-")) {
                localStorage.removeItem(key);
            }
        });
    };
    QueryableLogger.prototype.select = function (columns) {
        if (columns === void 0) { columns = ['id', 'message', 'type', 'timestamp', 'userDefinedAttrs']; }
        return new LoggerQueryContainer(this.logs, columns);
    };
    QueryableLogger.from = function (selected, type) {
        if (type === void 0) { type = "all" || "error" || "warn" || "log"; }
        return selected.filter(function (log) { return log.type === type; });
    };
    QueryableLogger.where = function (selected, key, value) {
        // determine if key is user defined attribute
        var isUserDefinedAttr = selected[0].userDefinedAttrs && selected[0].userDefinedAttrs[key];
        // value looks like ["=", "john doe"]
        if (value[0] === "=") {
            return selected.filter(function (log) {
                if (isUserDefinedAttr) {
                    return log.userDefinedAttrs[key] === value[1];
                }
                return log[key] === value[1];
            });
        }
        else if (value[0] === "!=") {
            return selected.filter(function (log) {
                if (isUserDefinedAttr) {
                    return log.userDefinedAttrs[key] !== value[1];
                }
                return log[key] !== value[1];
            });
        }
        else if (value[0] === ">") {
            return selected.filter(function (log) {
                if (isUserDefinedAttr) {
                    return log.userDefinedAttrs[key] > value[1];
                }
                return log[key] > value[1];
            });
        }
        else if (value[0] === "<") {
            return selected.filter(function (log) {
                if (isUserDefinedAttr) {
                    return log.userDefinedAttrs[key] < value[1];
                }
                return log[key] < value[1];
            });
        }
        else if (value[0] === ">=") {
            return selected.filter(function (log) {
                if (isUserDefinedAttr) {
                    return log.userDefinedAttrs[key] >= value[1];
                }
                return log[key] >= value[1];
            });
        }
        else if (value[0] === "<=") {
            return selected.filter(function (log) {
                if (isUserDefinedAttr) {
                    return log.userDefinedAttrs[key] <= value[1];
                }
                return log[key] <= value[1];
            });
        }
        else if (typeof value[1] === "string" && value[1] === "LIKE") {
            return selected.filter(function (log) {
                if (isUserDefinedAttr) {
                    return log.userDefinedAttrs[key].includes(value[2]);
                }
                return log[key].includes(value[2]);
            });
        }
        else if (typeof value[1] === "string" && value[1] === "NOT LIKE") {
            return selected.filter(function (log) {
                if (isUserDefinedAttr) {
                    return !log.userDefinedAttrs[key].includes(value[2]);
                }
                return !log[key].includes(value[2]);
            });
        }
        else {
            return selected;
        }
    };
    return QueryableLogger;
}());
exports["default"] = QueryableLogger;
var LoggerQueryContainer = /** @class */ (function () {
    function LoggerQueryContainer(logs, columns) {
        if (logs === void 0) { logs = []; }
        if (columns === void 0) { columns = ['id', 'message', 'type', 'timestamp', 'userDefinedAttrs']; }
        this.logs = [];
        this.columns = [];
        this.logs = logs;
        this.columns = columns;
    }
    LoggerQueryContainer.prototype.from = function (type) {
        if (type === void 0) { type = "all" || "error" || "warn" || "log"; }
        this.logs = QueryableLogger.from(this.logs, type);
        return this;
    };
    LoggerQueryContainer.prototype.where = function (key, value) {
        this.logs = QueryableLogger.where(this.logs, key, value);
        return this;
    };
    LoggerQueryContainer.prototype.get = function () {
        var _this = this;
        // Filter out columns not in this.columns
        return this.logs.map(function (log) {
            var newLog = {};
            _this.columns.forEach(function (column) {
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
    };
    return LoggerQueryContainer;
}());
