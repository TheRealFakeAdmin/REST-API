const router = require('express').Router();

const stringifyQuery = (q) => {
    let query = "?";
    for (let k in q) {
        query += `${k}=${q[k]}&`;
    }
    return query.replace(/[?&]$/, "");
}

const checkLive = require('./twitch/check_live');

router.get('/up', (req, res) => {
    
    const query = stringifyQuery(req.query);

    checkLive(query, (err, resp) => {
        if (err !== null) {
            res.send('An error has occured');
            return console.error(err);
        }
        res.send(resp);
    })
})

const getEndpoint = require('./twitch/endpoint');

router.get('/helix/:endpt/:endpt2?/:endpt3?', (req, res) => {
    let p = req.params;
    const query = stringifyQuery(req.query),
    params = p["endpt"] + (p["endpt2"] ? `/${p["endpt2"]}` : "") + (p["endpt3"] ? `/${p["endpt3"]}` : "");

    getEndpoint(params, query, (err, resp) => {
        if (err !== null) {
            res.send('An error has occured');
            return console.error(err);
        }
        res.send(resp);
    })
})

const log = require('./twitch/log');
router.get('/log', (req, res) => {
    log(req.ip, JSON.stringify(req.body));
    res.send();
})

module.exports = router;