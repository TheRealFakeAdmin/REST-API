/**
 * Parses data sent back from RocketLaunch.Live, returns next upcoming launch
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Object} resp 
 * @returns
 */
function parseNextRaw (req, res, resp) {
    let dt = Date.now(),
        chk = true,
        v,
        ln,
        ld,
        msg = "";

    for (v of resp.result) {
        ln = v.win_open || v.t0;
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
    
    switch (req.query.type ? req.query.type.toLowerCase() : "") {
        case "json":
            msg = v;
            break;
        case "summary":
        case "text":
        default:
            msg += `There is a planned ${v.weather_condition !== null ? v.weather_condition.toLowerCase() : ""} launch of a ${v.provider.name !== null ? v.provider.name : ""} ${v.vehicle.name ? v.vehicle.name : ""} rocket flying ${v.name ? v.name : ""} on ${wkds[ld.getDay()]}, ${mnths[ld.getMonth()]} ${ordinal_suffix_of(ld.getDate())} at ${ld.getHours() % 12}:${ld.getMinutes().toString().padStart(2, "0")} ${(ld.getHours() < 12) ? "AM" : "PM"}.`; // :${ld.getSeconds().toString().padStart(2, "0")}
            msg += ` This should launch out of ${v.pad.name !== null ? v.pad.name + " at " : ""}${v.pad.location.name}${(v.pad.location.statename !== null || v.pad.location.country !== null) ? " in " : "."}${(v.pad.location.statename === null) ? "" : `${v.pad.location.statename}${(v.pad.location.country === null) ? "." : ", "}`} ${(v.pad.location.country === null) ? "" : v.pad.location.country + "."}`
            if (req.query.tts === "true") msg += `<script>window.speechSynthesis.speak(new SpeechSynthesisUtterance(document.body.innerText))</script>`; // If `?tts=true`, TTS the response.
            break;
    }
    return msg;
}


module.exports = parseNext;
