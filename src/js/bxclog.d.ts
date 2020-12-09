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
    brackets?: "round" | "parentheses" | "()" | "square" | "box" | "[]" | "braces" | "curly" | "{}" | "angle" | "chevrons" | "<>";
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
}
export declare class BXCLog {
    options: IBXCLogOptions;
    private bracketsStart;
    private bracketsClose;
    constructor(_options: IBXCLogOptions);
    dateFormatFile: Intl.DateTimeFormat;
    dateFormat: Intl.DateTimeFormat;
    filePath: string;
    endl: string;
    info(service: string, ...data: any[]): void;
    debug(service: string, ...data: any[]): void;
    warn(service: string, ...data: any[]): void;
    error(service: string, ...data: any[]): void;
    private getBracketsType;
    private wrapService;
    private doLog;
}
