const parseSentence = require('./modules/parse_launch');


/**
 * Parses data sent back from RocketLaunch.Live, returns next upcoming launch
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Object} resp 
 * @returns
 */
function parseNext (req, res, resp) {
    let dt = Date.now(),
        chk = true,
        v,
        ln,
        ld,
        msg = "";

    for (v of resp.result) {
        ln = v.t0 || v.win_open;
        if (typeof ln === "string") {
            ld = new Date(ln);
            ln = ld.valueOf();
            if (ln > dt) {
                chk = false;
                break;
            }
        }
    }

    if (chk) return;

    res.setHeader("Source", "Data by RocketLaunch.Live"); // As long as RocketLaunch.Live is used, keep this message near the data.
    
    switch (req.query.type !== undefined ? req.query.type.toLowerCase() : "") {
        case "json":
            v.API_IS_DEPRECATED = "NOT FOR PUBLIC USE. Version 1 endpoints are being rewritten/reworked as Version 2 for faster response times. This endpoint has been upgraded and it is highly recommended to switch to using Version 2 in all existing and future projects. See /api/v2/launch/next";
            msg = v;
            break;
        case "summary":
        case "text":
        default:
            msg = parseSentence(v, msg);
            if (req.query.tts === "true") msg += `<script>window.speechSynthesis.speak(new SpeechSynthesisUtterance(document.body.innerText))</script>`; // If `?tts=true`, TTS the response.
            break;
    }
    return msg;
}


module.exports = parseNext;
