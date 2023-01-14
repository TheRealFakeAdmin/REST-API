require('dotenv').config();
const router = require('express').Router();
const https = require('https');

const accessTimeoutSec = Number(process.env.RLL_TIMEOUT); // Timeout for Accessing RocketLaunch.Live
const accessTimeoutMsc = Number(process.env.RLL_TIMEOUT) * 1000;
let lastAccess = {
        list: new Date(0).valueOf(),
        next: new Date(0).valueOf(),
        earliest: new Date(0).valueOf()
    },
    lastResp = {
        list: "",
        next: "",
        earliest: ""
    };

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
                    console.debug(data);
                    res.status(500);
                    res.send("Error");
                    return console.error(e);
                }
            })
        }
    )
}


/**
 * Parses data sent back from RocketLaunch.Live, returns next upcoming launch
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Object} resp 
 * @returns
 */
function parseList (req, res, resp) {
    let lst = [];

    for (v of resp.result) {
        lst.push(`${v.vehicle.name} - ${v.name} - ${new Date(v.win_open)}`);
    }

    res.setHeader("Source", "Data by RocketLaunch.Live"); // As long as RocketLaunch.Live is used, keep this message near the data.

    return lst;
}


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
            msg += `There will be a ${v.weather_condition.toLowerCase()} launch of a ${v.provider.name} ${v.vehicle.name} rocket flying ${v.name} on ${wkds[ld.getDay()]}, ${mnths[ld.getMonth()]} ${ordinal_suffix_of(ld.getDate())} at ${ld.getHours() % 12}:${ld.getMinutes().toString().padStart(2, "0")} ${(ld.getHours() < 12) ? "AM" : "PM"}.`; // :${ld.getSeconds().toString().padStart(2, "0")}
            msg += ` This will launch out of ${v.pad.location.name}${(v.pad.location.statename !== null || v.pad.location.country !== null) ? " in " : "."}${(v.pad.location.statename === null) ? "" : `${v.pad.location.statename}${(v.pad.location.country === null) ? "." : ", "}`} ${(v.pad.location.country === null) ? "" : v.pad.location.country + "."}`
            if (req.query.tts === "true") msg += `<script>window.speechSynthesis.speak(new SpeechSynthesisUtterance(document.body.innerText))</script>`; // If `?tts=true`, TTS the response.
            break;
    }
    return msg;
}

/**
 * Parses data sent back from RocketLaunch.Live, returns earliest result
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Object} resp 
 * @returns
 */
function parseEarliest (req, res, resp) {
    let v = resp.result[0],
        ln = v.win_open,
        ld = new Date(ln),
        msg = "";

    res.setHeader("Source", "Data by RocketLaunch.Live"); // As long as RocketLaunch.Live is used, keep this message near the data.
    
    switch (req.query.type ? req.query.type.toLowerCase() : "") {
        case "json":
            msg = v;
            break;
        case "summary":
        case "text":
        default:
            msg += `There will be a ${v.weather_condition.toLowerCase()} launch of a ${v.provider.name} ${v.vehicle.name} rocket flying ${v.name} on ${wkds[ld.getDay()]}, ${mnths[ld.getMonth()]} ${ordinal_suffix_of(ld.getDate())} at ${ld.getHours() % 12}:${ld.getMinutes().toString().padStart(2, "0")} ${(ld.getHours() < 12) ? "AM" : "PM"}.`; // :${ld.getSeconds().toString().padStart(2, "0")}
            msg += ` This will launch out of ${v.pad.location.name}${(v.pad.location.statename !== null || v.pad.location.country !== null) ? " in " : "."}${(v.pad.location.statename === null) ? "" : `${v.pad.location.statename}${(v.pad.location.country === null) ? "." : ", "}`} ${(v.pad.location.country === null) ? "" : v.pad.location.country + "."}`
            if (req.query.tts === "true") msg += `<script>window.speechSynthesis.speak(new SpeechSynthesisUtterance(document.querySelector('body').innerText))</script>`; // If `?tts=true`, TTS the response.
            break;
    }
    return msg;
}


/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
const listLaunch = (req, res) => {
    // Deal with Timeout
    let toT = Date.now() - accessTimeoutMsc;
    if ((toT < lastAccess.list)) { // If before timeout ends
        res.setHeader("Cache-Control", `max-age=${accessTimeoutSec}, must-revalidate`);
        res.setHeader("Age", String(accessTimeoutSec - Math.round((lastAccess.list - toT) / 1000)));
        res.status(200);
        res.send(parseList(req, res, lastResp.list));
        return void(0);
    }

    // Continue if not Timeout
    lastAccess.list = Date.now();

    res.setHeader("Cache-Control", "no-cache");

    getLaunches(req, res, (resp) => {
        lastResp.list = resp;
        let msg = parseList(req, res, resp);
        
        res.send(msg);
    })
}


/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns
 */
const nextLaunch = (req, res) => {
    // Deal with Timeout
    let toT = Date.now() - accessTimeoutMsc;
    if ((toT < lastAccess.next)) { // If before timeout ends
        res.setHeader("Cache-Control", `max-age=${accessTimeoutSec}, must-revalidate`);
        res.setHeader("Age", String(accessTimeoutSec - Math.round((lastAccess.next - toT) / 1000)));
        res.status(200);
        res.send(parseNext(req, res, lastResp.next));
        return void(0);
    }

    // Continue if not Timeout
    lastAccess.next = Date.now();

    res.setHeader("Cache-Control", "no-cache");

    getLaunches(req, res, (resp) => {
        lastResp.next = resp;
        let msg = parseNext(req, res, resp);
        
        res.send(msg);
    })
};


/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns
 */
const earliestLaunch = (req, res) => {
    // Deal with Timeout
    let toT = Date.now() - accessTimeoutMsc;
    if ((toT < lastAccess.earliest)) { // If before timeout ends
        res.setHeader("Cache-Control", `max-age=${accessTimeoutSec}, must-revalidate`);
        res.setHeader("Age", String(accessTimeoutSec - Math.round((lastAccess.earliest - toT) / 1000)));
        res.status(200);
        res.send(parseNext(req, res, lastResp.earliest));
        return void(0);
    }

    // Continue if not Timeout
    lastAccess.earliest = Date.now();

    res.setHeader("Cache-Control", "no-cache");

    getLaunches(req, res, (resp) => {
        lastResp.earliest = resp;
        let msg = parseNext(req, res, resp);
        
        res.send(msg);
    })
};


router.get('/', earliestLaunch);

router.get('/list', listLaunch);

router.get('/next', nextLaunch);

/* const launchData = require('./launch_data.js');

router.use('/data', launchData); */

module.exports = router;