const getLaunches = require('./modules/get_launches');
const parseLaunch = require('./modules/parse_launch');

const next = async (req, res) => {
    const resp = await getLaunches(res);

    let dt = Date.now(),
        chk = true,
        v,
        ln,
        ld;

    for (v of resp.result) {
        ln = v.t0 || v.win_open;
        if (typeof ln === "string") {
            ld = new Date(ln);
            ln = ld.valueOf();
            if (ln > dt) {
                break;
            }
        }
    }

    switch (req.query.type?.toLowerCase()) {
        case "json":
            res.json(v);
            return void(0);
        default:
            let msg = parseLaunch(v, undefined, ["on", "true", "1"].includes(req.query["twitch"]));
            if (req.query.tts === "true") msg += `<script>window.speechSynthesis.speak(new SpeechSynthesisUtterance(document.body.innerText))</script>`; // If `?tts=true`, TTS the response.
            res.send(msg);
            return void(0);
    }
}

module.exports = next;