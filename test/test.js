const clc = require("cli-color");
const locale = require('locale-codes')
const sleep = require("sleep");
const { BXCLog } = require("../index");

let totalTestsTime = 0;

/**
 * Capitalize
 * @param {string} s string
 */
function c(s) 
{
    return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * 
 * @param {instanceof BXCLog} bxcLog An instance of BXCLog with custom settings
 * @param {string} testName Name of the test (eg. AllowWrite)
 */
function doTest(bxcLog, testName)
{
    const __ = `[BXCLog:doTest] Test ${testName}`
    const time = () => Number(process.hrtime.bigint())
    let _start = time();
    let _end   = time();
    

    try {
        console.log(__, `started`);
        const prefix = "BXCLogTest:" + testName;

        // Start time of the test
        _start = time();
        bxcLog.debug(prefix, "Here is some debug info", Math.random());
        bxcLog.info (prefix, "This is an info message", Array(4), ["meow", "woof", "quacc"]);
        bxcLog.warn (prefix, "A very important warning", "does node support ipv6 -", process.features.ipv6);
        bxcLog.error(prefix, "All entries in database were deleted by", process.platform, "with node", process.versions.node);
        // End time of the test
        _end = time();

        console.log(__, `successful`);
    } catch (e) {
        console.error(__, `failed`, e);
    } finally {
        _end = time();
        const timeSpent = ~~((_end - _start) / 1000) / 1000;

        totalTestsTime += timeSpent;
        console.log(__, `finished in`, clc.blue(`${timeSpent}ms`));
    }

}


try {
    // Sleep for 1 second to give node enough time to compile the test file
    // This is done to test the real speed of a running, warmed up application
    sleep.sleep(1)

    const bxclog_warmup  = new BXCLog();
    const bxclog_defset  = new BXCLog();
    const bxclog_write   = new BXCLog({ saveToFile: true, saveFilePath: "logs" });
    const bxclog_nodebug = new BXCLog({ showDebug: false });
    const bxclog_brackets_round     = new BXCLog({ brackets: "round" });
    const bxclog_brackets_square    = new BXCLog({ brackets: "square" });
    const bxclog_brackets_braces    = new BXCLog({ brackets: "braces" });
    const bxclog_brackets_angle     = new BXCLog({ brackets: "angle" });
    
    const bxclog_tz = { 
        Africa: [
            "Maputo",
        ],
        America: [
            "Bahia_Banderas",
            "Matamoros",
            "Cancun",
        ],
        Asia: [
            "Shanghai",
            "Yekaterinburg",
        ],
        Australia: [
            "Sydney",
            "Queensland",
        ],
        Europe: [
            "Berlin",
            "London",
            "Moscow",
        ],
    };  

    doTest(bxclog_warmup,  "✨WARM UP - IGNORE✨");
    doTest(bxclog_defset,  "DefaultSettings");
    doTest(bxclog_write,   "AllowWrite");
    doTest(bxclog_nodebug, "NoDebug");
    doTest(bxclog_brackets_round,  "BracketsRound");
    doTest(bxclog_brackets_square, "BracketsSquare");
    doTest(bxclog_brackets_braces, "BracketsBraces");
    doTest(bxclog_brackets_angle,  "BracketsAngle");

    console.log("=============================== TIMEZONES =================================");

    // Disable this for faster tests

    // Go trough all timezones in the object bxclog_tz
    const testTimeZones = true;
    // testTimeZones must be enabled
    // Test ALL locales for each timezone
    const testTimeZoneLocales = false;

    // Test ALL locales with UTC
    const testLocales = true;

    if (testTimeZones)
    Object.keys(bxclog_tz).forEach((region) => {
        bxclog_tz[region].forEach((country) => {
            doTest(
                new BXCLog({ 
                    saveToFile: true, 
                    saveFilePath: "logs", 
                    timeZone: region + "/" + country
                }),
                `Timezone:${c(region)}:${c(country)}`
            );

            if (testTimeZoneLocales) 
            locale.all.forEach((_locale) => {
                try {
                    doTest(
                        new BXCLog({ 
                        saveToFile: true, 
                        saveFilePath: "logs", 
                        timeZone: region + "/" + country,
                        locale: _locale.tag,
                        }),
                        `Timezone:${c(region)}:${c(country)} - Locale:${c(_locale.tag)}`
                    );
                } catch (e) {
                    console.log(e.message);
                }
            });
        });
    });


    if (testLocales)
    locale.all.forEach((_locale) => {
        try {
            doTest(
                new BXCLog({ 
                    saveToFile: true, 
                    saveFilePath: "logs",
                    locale: _locale.tag,
                }),
                `Locale:${c(_locale.tag)}`
            );
        } catch (e) {
            console.log(e.message);
        }
    });

    if (testTimeZoneLocales || testLocales)
        console.log("Total number of locales", clc.blue(locale.all.length));
    console.log("Total testing time: ", clc.blue(`${totalTestsTime}ms`));

} catch (e) {
    console.error("BXCLog test failed", e)
}
