const router = require('express').Router();
const https = require('https');

const accessTimeout = 30000; // Timeout for Accessing RocketLaunch.Live
let lastAccess = new Date(0).valueOf(),
    lastResp = "";

// Date Setup
const wkds = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

const mnths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

/**
 * Adds the correct Ordinal Suffix to a number.
 * @param {number} i - Whole Number
 * @returns {string}
 */
function ordinal_suffix_of(i) { // src : https://gist.github.com/frank184/cb992e676e3aa85246dbcf1c2aaa3462
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

// The fun part

/**
 * Requests launch info from the RocketLaunch.Live, then feeds the raw data to the callback function
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {function} callback
 */
function getLaunches (req, res, callback) {
    https.get(
        "https://fdo.rocketlaunch.live/json/launches",
        {
            headers: {
                "Authorization": `Bearer ${process.env.ROCKET_LAUNCH_LIVE}`
            }
        },
        (rsp) => {
            let data = "";

            rsp.on('data', d => {
                data += d.toString('utf8');
            });

            rsp.on('end', () => {
                try {
                    let resp = JSON.parse(data);
                    callback(resp);
                    return void(0);
                } catch (e) {
                    res.status(500);
                    res.send("Error");
                    return console.error(e);
                }
            })
        }
    )
}

function parseData (req, res, resp) {
    let dt = Date.now(),
        chk = true,
        v,
        ln,
        ld,
        msg = "";

    for (v of resp.result) {
        ln = v.win_open;
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
            msg += `There will be a ${v.weather_condition.toLowerCase()} launch of a ${v.provider.name} ${v.vehicle.name} rocket on ${wkds[ld.getDay()]}, ${mnths[ld.getMonth()]} ${ordinal_suffix_of(ld.getDate())} at ${ld.getHours() % 12}:${ld.getMinutes().toString().padStart(2, "0")} ${(ld.getHours() < 12) ? "AM" : "PM"}.`; // :${ld.getSeconds().toString().padStart(2, "0")}
            msg += ` This will launch out of ${v.pad.location.name}${(v.pad.location.statename !== null || v.pad.location.country !== null) ? " in " : "."}${(v.pad.location.statename === null) ? "" : `${v.pad.location.statename}${(v.pad.location.country === null) ? "." : ", "}`} ${(v.pad.location.country === null) ? "" : v.pad.location.country + "."}`
            if (req.query.tts === "true") msg += `<script>window.speechSynthesis.speak(new SpeechSynthesisUtterance(document.querySelector('body').innerText))</script>`; // If `?tts=true`, TTS the response.
            break;
    }
    return msg;
}

const nextLaunch = (req, res) => {

    // Deal with Timeout
    if ((Date.now() - accessTimeout < lastAccess)) { // If before timeout ends
        res.status(401);
        res.send(parseData(req, res, lastResp));
        return void(0);
    }

    lastAccess = Date.now();

    // Continue if not Timeout
    getLaunches(req, res, (resp) => {
        lastResp = resp;
        let msg = parseData(req, res, resp);
        
        res.send(msg);
    })
};

router.get('/', nextLaunch);

router.get('/next', nextLaunch);

module.exports = router;