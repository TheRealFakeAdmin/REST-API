const
    router = require('express').Router(),
    https = require('https'),
    { JSDOM } = require('jsdom'),
    getCountdown = require('./modules/spacex-scraper'),
    fs = require('fs');

const handler = (req, res) => {
    requester(req, res);
}

const requester = (rq, rs) => {
    let missionId = rq.query['missionId'];
    if (typeof missionId !== "string") return;

    let output = "";

    const req = https.request({
        method: "GET",
        host: "www.spacex.com",
        port: 443,
        path: `/launches/mission/?missionId=${missionId}`,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5"
        }
    }, (res) => {
        console.debug('Status Code:', res.statusCode);

        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            console.debug('chunk');
            output += chunk;
        });

        res.on('end', () => {
            console.debug('end');
            console.debug(output);
            parser(res.statusCode, output, rq, rs);
        });
    });

    req.on('error', (err) => {
        console.warn(err);
    })

    req.end();console.debug('requester');
}

const parser = (statusCode, resp, req, res) => {
    if (![200, 304].includes(statusCode)) return res.send({errors: ["SpaceX query did not return OK"]});console.debug('parser');

    let { document } = new JSDOM(resp).window;
    
    res.send(getCountdown.asCSV(document));
}



router.get('/', handler);

module.exports = router;

/*

T-Time     Event
2280       SpaceX Launch Director verifies go for propellant load
2100       RP-1 (rocket grade kerosene) loading begins
2100       1st stage LOX (liquid oxygen) loading begins
960        2nd stage LOX loading begins
420        Falcon 9 begins engine chill prior to launch
60         Command flight computer to begin final prelaunch checks
60         Propellant tank pressurization to flight pressure begins
45         SpaceX Launch Director verifies go for launch
3          Engine controller commands engine ignition sequence to start
0          Falcon 9 liftoff

T+Time     Event
72         Max Q (moment of peak mechanical stress on the rocket)
148        1st stage main engine cutoff (MECO)
151        1st and 2nd stages separate
158        2nd stage engine starts (SES-1)
162        Fairing deployment
402        1st stage entry burn begins
420        1st stage entry burn ends
503        1st stage landing burn begins
523        2nd stage engine cutoff (SECO-1)
524        1st stage landing
1129       Starlink satellites deploy"

*/