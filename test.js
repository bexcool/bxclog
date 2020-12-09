const clc = require("cli-color");
const sleep = require("sleep");
const { BXCLog } = require("./index");

/**
 * 
 * @param {instanceof BXCLog} bxcLog An instance of BXCLog with custom settings
 * @param {string} testName Name of the test (eg. AllowWrite)
 */
function doTest(bxcLog, testName)
{
    const __ = `[BXCLog:doTest] Test ${testName}`
    const time = () => Number(process.hrtime.bigint())
    let _start = 0;
    let _end   = 0;
    

    try {
        console.log(__, `started`);
        const prefix = "BXCLogTest:" + testName;

        // Start time of the test
        _start = time();
        bxcLog.debug(prefix, "Here is some debug info", process.cpuUsage());
        bxcLog.info (prefix, "This is an info message", new Uint8Array(), ["meow", "woof", "quacc"]);
        bxcLog.warn (prefix, "A very important warning", process.memoryUsage());
        bxcLog.error(prefix, "All entries in database were deleted by", process.platform, "with node", process.release);
        // End time of the test
        _end = time();

        console.log(__, `successful`);
    } catch (e) {
        console.error(__, `failed`, e);
    } finally {
        const _end = Number(process.hrtime.bigint());

        console.log(__, `finished in`, clc.blue(`${~~((_end - _start) / 1000) / 1000} ms`));
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

    doTest(bxclog_warmup,  "✨WARM UP - IGNORE✨");
    doTest(bxclog_defset,  "DefaultSettings");
    doTest(bxclog_write,   "AllowWrite");
    doTest(bxclog_nodebug, "NoDebug");
    doTest(bxclog_brackets_round,  "BracketsRound");
    doTest(bxclog_brackets_square, "BracketsSquare");
    doTest(bxclog_brackets_braces, "BracketsBraces");
    doTest(bxclog_brackets_angle,  "BracketsAngle");

} catch (e) {
    console.error("BXCLog test failed", e)
}
