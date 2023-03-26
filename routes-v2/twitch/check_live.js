require('dotenv').config();

const https = require('https');
const checkTimeout = require('./modules/check_timeout');

const TwitchClientId = process.env.TWITCH_CLIENT_ID;
const TwitchApiHost = "api.twitch.tv";
const StreamApiEndpoint = "/helix/streams";

const checkLive = async (query, callback) => {
    const options = {
        hostname: TwitchApiHost,
        port: 443,
        path: StreamApiEndpoint + query,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.TWITCH_BEARER_TOKEN}`,
            'Client-Id': TwitchClientId
        }
    }

    await checkTimeout.get(StreamApiEndpoint);

    try {
        https.get(options, (res) => {
            let data = '';

            checkTimeout.set(StreamApiEndpoint, res.headers);

            // const dt = new Date().valueOf(),
            // rdt = new Date(res.headers["ratelimit-reset"] * 1000).valueOf(),
            // rem = Number(res.headers["ratelimit-remaining"]),
            // nxtEvt = (rdt - dt) / rem;
            // console.log(nxtEvt, dt, rdt, rem);

            res.on('data', (d) => {
              data += d;
            });

            res.on('close', () => {
                data = JSON.parse(data);
                callback(null, data);
            });
          
        }).on('error', (e) => {
            callback(e, null);
        });
    } catch (e) {
        callback(e, null);
    }
};

module.exports = checkLive;