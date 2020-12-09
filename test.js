const clc = require("cli-color");
const { time } = require("console");
const sleep = require("sleep");
const { BXCLog } = require("./index");

let totalTestsTime = 0;

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
        africa: {
            central: new BXCLog({ timeZone: "Africa/Maputo", saveToFile: true, saveFilePath: "logs" }),
        },
        america: {
            central: new BXCLog({ timeZone: "America/Bahia_Banderas", saveToFile: true, saveFilePath: "logs" }),
            central_us: new BXCLog({ timeZone: "America/Matamoros", saveToFile: true, saveFilePath: "logs" }),
            nyc: new BXCLog({ timeZone: "America/New_York", saveToFile: true, saveFilePath: "logs" }),
            est: new BXCLog({ timeZone: "America/Cancun", saveToFile: true, saveFilePath: "logs" }),
        },
        asia: {
            beijing: new BXCLog({ timeZone: "Asia/Shanghai", saveToFile: true, saveFilePath: "logs" }),
            yekaterinburg: new BXCLog({ timeZone: "Asia/Yekaterinburg", saveToFile: true, saveFilePath: "logs" }),
        },
        australia: {
            sydney: new BXCLog({ timeZone: "Australia/Sydney", saveToFile: true, saveFilePath: "logs" }),
            queen:  new BXCLog({ timeZone: "Australia/Queensland", saveToFile: true, saveFilePath: "logs" }),
        },
        europe: {
            germany: new BXCLog({ timeZone: "Europe/Berlin", saveToFile: true, saveFilePath: "logs" }),
            england: new BXCLog({ timeZone: "Europe/London", saveToFile: true, saveFilePath: "logs" }),
            russia:  new BXCLog({ timeZone: "Europe/Moscow", saveToFile: true, saveFilePath: "logs" }),
            switzerland: new BXCLog({ timeZone: "Europe/Zurich", saveToFile: true, saveFilePath: "logs" }),
        },
        etc: {
            gmt: new BXCLog({ timeZone: "GMT", saveToFile: true, saveFilePath: "logs" })
        }
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

    Object.keys(bxclog_tz).forEach((region) => {
        Object.keys(bxclog_tz[region]).forEach((timezone) => {
            // Capitalize
            const c = s => s.charAt(0).toUpperCase() + s.slice(1);

            doTest(bxclog_tz[region][timezone], `Timezone:${c(region)}:${c(timezone)}`)
        })
    })

    console.log("Total testing time: ", clc.blue(`${totalTestsTime}ms`));

} catch (e) {
    console.error("BXCLog test failed", e)
}
