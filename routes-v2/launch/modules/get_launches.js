const { rllc } = require('rocket-launch-live-client');
const RLL_API_KEY = process.env.ROCKET_LAUNCH_LIVE;
const client = rllc(RLL_API_KEY);

const rllTimeoutSec = Number(process.env.RLL_TIMEOUT);
const rllTimeoutMsc = rllTimeoutSec * 1000;

let lastResp = {
    launches: [
        0,
        {}
    ]
}

const getLaunches = async (res) => {
    let resp = {},
    dt = Date.now();

    switch (lastResp.launches[0] > (dt - rllTimeoutMsc)) {
        case false: // After timeout ends
            console.debug("Request");
            resp = await client.launches();
            lastResp.launches = [dt, resp];
            if (res?.setHeader) res.setHeader("Cache-Control", "no-cache");
            break;
        case true: // Under timeout
        default:
            console.debug("Cache");
            resp = lastResp.launches[1];
            if (res?.setHeader) {
                res.setHeader("Cache-Control", `max-age=${rllTimeoutSec}, must-revalidate`);
                res.setHeader("Age", String(Math.floor((dt - lastResp.launches[0]) / 1000)));
            }
            break;
    }
    if (res?.setHeader) res.setHeader("Legal", "Data by RocketLaunch.Live") // As long as RocketLaunch.Live is used, keep this message near the data.
    return resp
}

getLaunches.getLaunches = getLaunches;

module.exports = getLaunches;