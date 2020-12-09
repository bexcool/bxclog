import clc from "cli-color";
import fs from "fs";
import path from "path";

export interface IBXCLogOptions {
    /**
     * Any locale.
     * eg. en-GB, de-DE, en-US
     */
    locale?: string | string[];

    /**
     * Any timezone.
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
    saveToFile?: boolean;

    /**
     * Where should the file be stored.
     * SaveToFile must be enabled for this to have effect.
     * Relative to the entry file (eg. index.js).
     * eg. "../logs"
     */
    saveFilePath?: string;

    /**
     * Changes whether debug entires are shown.
     * Should be changed by the value of an environment variable.
     * eg. `environment == "release"`
     */
    showDebug?: boolean;
}

type LogType = "debug" | "info" | "warn" | "error";

/**
 * Default constructor options
 */
const BXCLogDefaultOptions: Required<IBXCLogOptions> = {
    locale:   "en-GB",
    timeZone: "UTC",
    brackets: "square",
    saveToFile: false,
    saveFilePath: "logs",
    showDebug: true,
};


export class BXCLog {
    // Class options
    // Object.create is used here to not overwrite the original constant
    private options: IBXCLogOptions = Object.create(BXCLogDefaultOptions);
    // Brackets that will be used for logging
    private bracketsStart = "[";
    private bracketsClose = "]";
    // New Line
    private endl = "\n";
    // Date for .log files
    private dateFormatFile = Intl.DateTimeFormat(this.options.locale, {
        timeZone: this.options.timeZone,
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    });
    // Date for console output
    private dateFormat = Intl.DateTimeFormat(this.options.locale, {
        timeZone: this.options.timeZone,
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    // Where the log file is stored
    private filePath = "";

    constructor(_options: IBXCLogOptions = BXCLogDefaultOptions) {
        const IntlOptions = Intl.DateTimeFormat().resolvedOptions();
        
        if (_options.locale == "auto") 
            _options.locale = IntlOptions.locale;
        if (_options.timeZone == "auto") 
            _options.timeZone = IntlOptions.timeZone;

        // Assign the new properties to the default settings
        Object.assign(this.options, _options);

        this.getBracketsType();
        
        // If saving to a file is enabled, get the path of the file
        if (this.options.saveToFile)
        {
            let entryPath = path.dirname(require.main?.path ?? ".");
            let filePath = this.options.saveFilePath;

            // add "/" to the end of the path if missing
            if (!filePath?.endsWith(path.sep))
                filePath += path.sep;
            if (!entryPath?.endsWith(path.sep))
                entryPath += path.sep;

            this.filePath = path.resolve(entryPath + filePath + this.dateFormatFile.format(new Date()) + ".bxc.log")
        }
    }
    
    debug(service: string, ...data: any[]): void {
        if (!this.options.showDebug)
            return;
        this.doLog("debug", service, ...data);
    }

    info(service: string, ...data: any[]): void {
        this.doLog("info", service, ...data);
    }

    warn(service: string, ...data: any[]): void {
        this.doLog("warn", service, ...data);
    }

    error(service: string, ...data: any[]): void {
        this.doLog("error", service, ...data);
    }


    private getBracketsType(): void
    {
        let start = "[";
        let close = "]";
        
        // TODO: Make this into a lookup table
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

    private wrapString(s: string) {
        return this.bracketsStart + s + this.bracketsClose;
    }

    private doLog(type: LogType, _service: string, ...data: any[]) {
        const date = this.dateFormat.format(new Date());

        _service = _service.trim();
        let service = _service;

        // TODO: Make this into a lookup table
        switch (type)
        {
            case "debug":
                service = clc.green(service);
                break;
            case "info":
                service = clc.blueBright(service);
                break;
            case "warn":
                service = clc.yellow(service);
                break;
            case "error":
                service = clc.red(service);
                break;
            default:
                service = clc.magenta(service);
                break;
        }

        console.log(this.wrapString(date), this.wrapString(service), ...data);

        if (this.options.saveToFile)
            fs.appendFileSync(this.filePath, [this.wrapString(date), `(${type})`, this.wrapString(_service), ...data, this.endl].join(" "));
    }
}
