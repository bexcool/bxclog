const { BXCLog } = require("./index");

try {
    const prefix = "BXCLogTest"
    const bxclog_def = new BXCLog();
    bxclog_def.info (prefix)
    bxclog_def.warn (prefix)
    bxclog_def.error(prefix);
    bxclog_def.debug(prefix, "(BBON_Common) - Any control characters are the same as other", "\n", BBONCommonTest);

} catch (e) {
    console.error(prefix, "BBON_Common Constants tests failed", e)
}
