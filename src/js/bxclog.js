"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BXCLog = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
/**
 * Default constructor options
 */
const BXCLogDefaultOptions = {
    locale: "en-GB",
    timeZone: "UTC",
    brackets: "square",
    saveToFile: false,
    saveFilePath: "logs",
    showDebug: true,
};
class BXCLog {
    constructor(_options = BXCLogDefaultOptions) {
        // Class options
        // Object.create is used here to not overwrite the original constant
        this.options = Object.create(BXCLogDefaultOptions);
        // Brackets that will be used for logging
        this.bracketsStart = "[";
        this.bracketsClose = "]";
        // New Line
        this.endl = "\n";
        // Date for .log files
        this.dateFormatFile = Intl.DateTimeFormat(this.options.locale, {
            timeZone: this.options.timeZone,
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        });
        // Date for console output
        this.dateFormat = Intl.DateTimeFormat(this.options.locale, {
            timeZone: this.options.timeZone,
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        // Where the log file is stored
        this.filePath = "";
        const IntlOptions = Intl.DateTimeFormat().resolvedOptions();
        if (_options.locale == "auto")
            _options.locale = IntlOptions.locale;
        if (_options.timeZone == "auto")
            _options.timeZone = IntlOptions.timeZone;
        // Assign the new properties to the default settings
        Object.assign(this.options, _options);
        this.getBracketsType();
        // If saving to a file is enabled, get the path of the file
        if (this.options.saveToFile) {
            let entryPath = path_1.default.dirname(require.main?.path ?? ".");
            let filePath = this.options.saveFilePath;
            // add "/" to the end of the path if missing
            if (!filePath?.endsWith(path_1.default.sep))
                filePath += path_1.default.sep;
            if (!entryPath?.endsWith(path_1.default.sep))
                entryPath += path_1.default.sep;
            this.filePath = path_1.default.resolve(entryPath + filePath + this.dateFormatFile.format(new Date()) + ".bxc.log");
        }
    }
    debug(service, ...data) {
        if (!this.options.showDebug)
            return;
        this.doLog("debug", service, ...data);
    }
    info(service, ...data) {
        this.doLog("info", service, ...data);
    }
    warn(service, ...data) {
        this.doLog("warn", service, ...data);
    }
    error(service, ...data) {
        this.doLog("error", service, ...data);
    }
    getBracketsType() {
        let start = "[";
        let close = "]";
        // TODO: Make this into a lookup table
        switch (this.options.brackets) {
            case "round":
            case "parentheses":
            case "()":
                start = "(";
                close = ")";
                break;
            case "square":
            case "box":
            case "[]":
                start = "[";
                close = "]";
                break;
            case "curly":
            case "braces":
            case "{}":
                start = "{";
                close = "}";
                break;
            case "angle":
            case "chevrons":
            case "<>":
                start = "<";
                close = ">";
                break;
            default:
                start = "[";
                close = "]";
                break;
        }
        this.bracketsStart = start;
        this.bracketsClose = close;
    }
    wrapString(s) {
        return this.bracketsStart + s + this.bracketsClose;
    }
    doLog(type, _service, ...data) {
        const date = this.dateFormat.format(new Date());
        _service = _service.trim();
        let service = _service;
        // TODO: Make this into a lookup table
        switch (type) {
            case "debug":
                service = cli_color_1.default.green(service);
                break;
            case "info":
                service = cli_color_1.default.blueBright(service);
                break;
            case "warn":
                service = cli_color_1.default.yellow(service);
                break;
            case "error":
                service = cli_color_1.default.red(service);
                break;
            default:
                service = cli_color_1.default.magenta(service);
                break;
        }
        console.log(this.wrapString(date), this.wrapString(service), ...data);
        if (this.options.saveToFile)
            fs_1.default.appendFileSync(this.filePath, [this.wrapString(date), `(${type})`, this.wrapString(_service), ...data, this.endl].join(" "));
    }
}
exports.BXCLog = BXCLog;
