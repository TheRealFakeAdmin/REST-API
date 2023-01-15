require('dotenv').config();
const router = require('express').Router();
const https = require('https');

const Joi = require('joi');
const schema = Joi.object({
    /* token: Joi.string()
        .alphanum()
        .min(16)
        .max(64)
        .required(), */
    query: Joi.string()
        .max(256)
});

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


const parseList = require('./launch_routes/list.js').list;
const parseSelectList = require('./launch_routes/list.js').select;
const parseNext = require('./launch_routes/next.js');
const parseEarliest = require('./launch_routes/latest.js');
const { isSchema } = require('joi');


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
        switch (req.get('name') != undefined || "name" in req.query) {
            case true:
                res.send(parseSelectList(req, res, lastResp.list));
                break;
            case false:
                res.send(parseList(req, res, lastResp.list));
                break;
        }
        return void(0);
    }

    // Continue if not Timeout
    lastAccess.list = Date.now();

    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Source", "Data by RocketLaunch.Live") // As long as RocketLaunch.Live is used, keep this message near the data.

    getLaunches(req, res, (resp) => {
        lastResp.list = resp;
        let msg;

        switch (req.get('name') != undefined || "name" in req.query) {
            case true:
                msg = parseSelectList(req, res, resp);
                break;
            case false:
                msg = parseList(req, res, resp);
                break;
        }
        
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