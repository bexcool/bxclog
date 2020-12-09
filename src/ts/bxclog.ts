import clc from "cli-color";
import fs from "fs";
import path from "path";

export interface IBXCLogOptions {
    /**
     * Any locale
     * eg. en-GB, de-DE, en-US
     */
    locale?: string | string[];

    /**
     * Any timezone
     * https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
     */
    timeZone?: string;

    /**
     * Which type of brackets to use
     */
    brackets?:
          "round"  | "parentheses" | "()"
        | "square" | "box"         | "[]"
        | "braces" | "curly"       | "{}"
        | "angle"  | "chevrons"    | "<>";
    
    /**
     * Should the log be saved into a file?
     */
    saveToFile: boolean;

    /**
     * Where should the file be stored
     * SaveToFile must be enabled for this to have effect
     * eg. "../logs"
     */
    saveFilePath: string;

    /**
     * Changes whether debug entires are shown
     * Should be changed by the value of an environment variable
     * eg. `environment == "release"`
     */
    showDebug: boolean;
}

const BXCLogDefaultOptions: Required<IBXCLogOptions> = {
    locale:   "en-GB",
    timeZone: "UTC",
    brackets: "square",
    saveToFile: false,
    saveFilePath: "logs",
    showDebug: true,
};

export class BXCLog {
    private options: IBXCLogOptions = BXCLogDefaultOptions;
    private bracketsStart = "[";
    private bracketsClose = "]";
    private endl = "\n";
    private dateFormatFile = Intl.DateTimeFormat(this.options.locale, {
        timeZone: this.options.timeZone,
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    });
    private dateFormat = Intl.DateTimeFormat(this.options.locale, {
        timeZone: this.options.timeZone,
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    private filePath = path.resolve(this.options.saveFilePath + this.dateFormatFile.format(new Date()) + ".bxc.log");

    constructor(_options: IBXCLogOptions) {
        const IntlOptions = Intl.DateTimeFormat().resolvedOptions();
        
        if (_options.locale == "auto") 
            _options.locale = IntlOptions.locale;
        if (_options.timeZone == "auto") 
            _options.timeZone = IntlOptions.timeZone;

        // Assign the new properties to the default settings
        Object.assign(this.options, _options);

        this.getBracketsType();
    }

    info(service: string, ...data: any[]): void {
        const date = this.dateFormat.format(new Date());

        console.log(date, clc.yellow(this.wrapService(service)), ...data);
        fs.appendFileSync(this.filePath, [date, "(info) ", this.wrapService(service), ...data, this.endl].join(" "));
    }

    debug(service: string, ...data: any[]): void {
        if (!this.options.showDebug)
            return;
        const date = this.dateFormat.format(new Date());

        console.log(date, clc.green(this.wrapService(service)), ...data);
        fs.appendFileSync(this.filePath, [date, "(debug)", this.wrapService(service), ...data, this.endl].join(" "));
    }

    warn(service: string, ...data: any[]): void {
        const date = this.dateFormat.format(new Date());

        console.log(date, clc.bgYellow(clc.black(this.wrapService(service))), ...data);
        fs.appendFileSync(this.filePath, [date, "(warn) ", this.wrapService(service), ...data, this.endl].join(" "));
    }

    error(service: string, ...data: any[]): void {}


    private getBracketsType(): void
    {
        let start = "[";
        let close = "]";
        
        switch (this.options.brackets)
        {
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

    private wrapService(s: string) {
        return "".concat(this.bracketsStart, s, this.bracketsClose);
    }

    private doLog(service: string, ...data: any[]) {
        const date = this.dateFormat.format(new Date());

        console.log(date, this.wrapService(service), ...data);
        fs.appendFileSync(this.filePath, [date, "(error)", this.wrapService(service), ...data, this.endl].join(" "));
    }
}
