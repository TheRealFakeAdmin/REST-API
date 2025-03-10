const parseSentence = require('./modules/parse_launch');


/**
 * Parses data sent back from RocketLaunch.Live, returns earliest result
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Object} resp 
 * @returns
 */
function parseEarliest (req, res, resp) {
    let v = resp.result[0],
        msg = "";

    res.setHeader("Source", "Data by RocketLaunch.Live"); // As long as RocketLaunch.Live is used, keep this message near the data.
    
    switch (req.query.type ? req.query.type.toLowerCase() : "") {
        case "json":
            v.API_IS_DEPRECATED = "NOT FOR PUBLIC USE. Version 1 endpoints are being rewritten/reworked as Version 2 for faster response times. This endpoint has been upgraded and it is highly recommended to switch to using Version 2 in all existing and future projects. See /api/v2/launch/latest";
            msg = v;
            break;
        case "summary":
        case "text":
        default:
            msg = parseSentence(v, msg);
            if (req.query.tts === "true") msg += `<script>window.speechSynthesis.speak(new SpeechSynthesisUtterance(document.body.innerText))</script>`; // If `?tts=true`, TTS the response.            break;
    }
    return msg;
}


module.exports = parseEarliest;
