const router = require('express').Router();
const https = require('https');

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

function ordinal_suffix_of(i) {
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

function getLaunches (callback) {
    https.get(
        "https://fdo.rocketlaunch.live/json/launches",
        {
            headers: {
                "Authorization": `Bearer ${process.env.ROCKET_LAUNCH_LIVE}`
            }
        },
        (res) => {
            let data = "";

            res.on('data', d => {
                data += d.toString('utf8');
            });

            res.on('end', () => {
                callback(data);
            })
        }
    )
}

const nextLaunch = (req, rsp) => {
    getLaunches((data) => {
        let resp = JSON.parse(data),
            dt = Date.now(),
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

        msg += `There will be a ${v.weather_condition.toLowerCase()} launch of a ${v.provider.name} ${v.vehicle.name} rocket on ${wkds[ld.getDay()]}, ${mnths[ld.getMonth()]} ${ordinal_suffix_of(ld.getDate())} at ${ld.getHours() % 12}:${ld.getMinutes().toString().padStart(2, "0")} ${(ld.getHours() < 12) ? "AM" : "PM"}.`; // :${ld.getSeconds().toString().padStart(2, "0")}
        msg += ` This will launch out of ${v.pad.location.name}${(v.pad.location.statename !== null || v.pad.location.country !== null) ? " in " : "."}${(v.pad.location.statename === null) ? "" : `${v.pad.location.statename}${(v.pad.location.country === null) ? "." : ", "}`} ${(v.pad.location.country === null) ? "" : v.pad.location.country + "."}`
        rsp.setHeader("Source", "Data by RocketLaunch.Live"); // As long as RocketLaunch.Live is used, keep this message near the data.
        if (req.query.tts === "true") msg += `<script>window.speechSynthesis.speak(new SpeechSynthesisUtterance(document.querySelector('body').innerText))</script>`; // If `?tts=true`, TTS the response.
        rsp.send(msg);
    })
};

router.get('/', nextLaunch);

router.get('/next', nextLaunch);

module.exports = router;


/*
let resp = JSON.parse(data),
                    dt = Date.now(),
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

                msg += `There will be a ${v.weather_condition.toLowerCase()} launch of a ${v.provider.name} ${v.vehicle.name} rocket on ${wkds[ld.getDay()]}, ${mnths[ld.getMonth()]} ${ordinal_suffix_of(ld.getDate())} at ${ld.getHours() % 12}:${ld.getMinutes().toString().padStart(2, "0")} ${(ld.getHours() < 12) ? "AM" : "PM"}.` // :${ld.getSeconds().toString().padStart(2, "0")}
                rsp.send(msg);
*/

/*
https.get(
        "https://fdo.rocketlaunch.live/json/launches",
        {
            headers: {
                "Authorization": `Bearer ${process.env.ROCKET_LAUNCH_LIVE}`
            }
        },
        (res) => {
            let data = "";

            res.on('data', d => {
                data += d.toString('utf8');
            });

            res.on('end', () => {
                let resp = JSON.parse(data),
                    dt = Date.now(),
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

                msg += `There will be a ${v.weather_condition.toLowerCase()} launch of a ${v.provider.name} ${v.vehicle.name} rocket on ${wkds[ld.getDay()]}, ${mnths[ld.getMonth()]} ${ordinal_suffix_of(ld.getDate())} at ${ld.getHours() % 12}:${ld.getMinutes().toString().padStart(2, "0")} ${(ld.getHours() < 12) ? "AM" : "PM"}.` // :${ld.getSeconds().toString().padStart(2, "0")}
                rsp.send(msg);
            })
        }
    )
*/