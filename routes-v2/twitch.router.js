const router = require('express').Router();

const checkLive = require('./twitch/check_live');

router.get('/up', (req, res) => {
    
    const query = stringifyQuery(req.query);

    checkLive(query, (err, resp) => {
        if (err !== null) {
            res.send('An error has occurred');
            return console.error(err);
        }
        res.send(resp);
    })
})

const getEndpoint = require('./twitch/endpoint');

router.get('/helix/:endpt/:endpt2?/:endpt3?', async (req, res) => {
    let p = req.params;console.debug('helix');
    const params = p["endpt"] + (p["endpt2"] ? `/${p["endpt2"]}` : "") + (p["endpt3"] ? `/${p["endpt3"]}` : "");

    const twitchApiResponse = await getEndpoint(params, req.query);
    res.send(twitchApiResponse);
})

// const log = require('./twitch/log');
router.get('/log', (req, res) => {
    console.log(req.ip, JSON.stringify(req.body));
    res.send();
})


const twitchOauth2 = require('./twitch/modules/twitch_oauth');
router.use('/oauth2', twitchOauth2);

module.exports = router;