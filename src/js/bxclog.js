"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BXCLog = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const BXCLogDefaultOptions = {
    locale: "en-GB",
    timeZone: "UTC",
    brackets: "square",
    saveToFile: false,
    saveFilePath: "logs"
};
class BXCLog {
    constructor(_options) {
        this.options = BXCLogDefaultOptions;
        this.bracketsStart = "[";
        this.bracketsClose = "]";
        this.dateFormatFile = Intl.DateTimeFormat(this.options.locale, {
            timeZone: this.options.timeZone,
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        });
        this.dateFormat = Intl.DateTimeFormat(this.options.locale, {
            timeZone: this.options.timeZone,
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        this.filePath = path_1.default.resolve(`${__dirname}/../../../logs/${this.dateFormatFile.format(new Date())}.log`);
        this.endl = "\n";
        const IntlOptions = Intl.DateTimeFormat().resolvedOptions();
        if (_options.locale == "auto")
            _options.locale = IntlOptions.locale;
        if (_options.timeZone == "auto")
            _options.timeZone = IntlOptions.timeZone;
        // Assign the new properties to the default settings
        Object.assign(this.options, _options);
        this.getBracketsType();
    }
    info(service, ...data) {
        const date = this.dateFormat.format(new Date());
        console.log(date, cli_color_1.default.yellow(this.wrapService(service)), ...data);
        fs_1.default.appendFileSync(this.filePath, [date, "(info) ", this.wrapService(service), ...data, this.endl].join(" "));
    }
    debug(service, ...data) {
        const date = this.dateFormat.format(new Date());
        console.log(date, cli_color_1.default.green(this.wrapService(service)), ...data);
        fs_1.default.appendFileSync(this.filePath, [date, "(debug)", this.wrapService(service), ...data, this.endl].join(" "));
    }
    warn(service, ...data) {
        const date = this.dateFormat.format(new Date());
        console.log(date, cli_color_1.default.bgYellow(cli_color_1.default.black(this.wrapService(service))), ...data);
        fs_1.default.appendFileSync(this.filePath, [date, "(warn) ", this.wrapService(service), ...data, this.endl].join(" "));
    }
    error(service, ...data) { }
    getBracketsType() {
        let start = "[";
        let close = "]";
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
    wrapService(s) {
        return "".concat(this.bracketsStart, s, this.bracketsClose);
    }
    doLog(service, ...data) {
        const date = this.dateFormat.format(new Date());
        console.log(date, this.wrapService(service), ...data);
        fs_1.default.appendFileSync(this.filePath, [date, "(error)", this.wrapService(service), ...data, this.endl].join(" "));
    }
}
exports.BXCLog = BXCLog;
