require('dotenv').config();
const router = require('express').Router();
const https = require('https');
const { builtinModules } = require('module');

const accessTimeoutSec = Number(process.env.RLL_TIMEOUT); // Timeout for Accessing RocketLaunch.Live
const accessTimeoutMsc = Number(process.env.RLL_TIMEOUT) * 1000;
let lastAccess = {
        next: new Date(0).valueOf(),
        earliest: new Date(0).valueOf()
    },
    lastResp = {
        next: "",
        earliest: ""
    };


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

router.get('/', (req, res) => {
    res.send(`{"errors":["This page does not yet exist."]}`);
    /* res.send(getLaunches(req, res, (resp) => {
        res.send(resp.result);
     }))*/;
})

module.exports = router;