const { unescape: decodeURIComponent } = require('querystring')
const parseSentence = require('./modules/parse_launch');


let lastList = [];

function listLoop (resp) {
    let lst = [];

    for (v of resp.result) {
        lst.push(`${v.vehicle.name} - ${v.name} - ${new Date(v.win_open || v.t0)}`);
    }

    return lst;
}


/**
 * Parses data sent back from RocketLaunch.Live, returns next upcoming launch
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Object} resp 
 * @returns
 */
function parseList (req, res, resp) {
    let lst = listLoop(resp);
    lastList = lst;

    return lst;
}


function parseSelectList (req, res, resp) {
    let lst = lastList.length > 0 ? lastList : listLoop(resp);
        msg = "",
        nme = req.get('name') != undefined ? req.header('name') : decodeURIComponent(req.query.name);

    console.debug(nme, lastList);

    if (!lst.includes(nme)) return `{errors:["Not a valid name"]}`; // Stop if error

    let v = resp.result[lst.indexOf(nme)];

    switch (req.query.type !== undefined ? req.query.type.toLowerCase() : "") {
        case "json":console.debug('json');
            v.API_IS_DEPRECATED = "NOT FOR PUBLIC USE. Version 1 endpoints are being rewritten/reworked as Version 2 for faster response times. This endpoint has been upgraded and it is highly recommended to switch to using Version 2 in all existing and future projects. See /api/v2/launch/next";
            msg = v;
            break;
        case "summary":
        case "text":
        default:console.debug('default');
            msg = parseSentence(v, msg);
            if (req.query.tts === "true") msg += `<script>window.speechSynthesis.speak(new SpeechSynthesisUtterance(document.body.innerText))</script>`; // If `?tts=true`, TTS the response.
            break;
    }

    // msg = parseSentence(v, msg);
    // if (req.query.tts === "true") msg += `<script>window.speechSynthesis.speak(new SpeechSynthesisUtterance(document.body.innerText))</script>`; // If `?tts=true`, TTS the response.

    return msg;
}


module.exports = {
    list: parseList,
    select: parseSelectList
};
