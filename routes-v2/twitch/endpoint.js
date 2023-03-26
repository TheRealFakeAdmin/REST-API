require('dotenv').config();

const https = require('https');
const checkTimeout = require('./modules/check_timeout');

const TwitchClientId = process.env.TWITCH_CLIENT_ID;
const TwitchApiHost = "api.twitch.tv";
const StreamApiEndpoint = "/helix/";

const getEndpoint = async (endpt, query, callback) => {
    const options = {
        hostname: TwitchApiHost,
        port: 443,
        path: StreamApiEndpoint + endpt + query,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.TWITCH_BEARER_TOKEN}`,
            'Client-Id': TwitchClientId
        }
    }

    await checkTimeout.get(StreamApiEndpoint + endpt);

    try {
        https.get(options, (res) => {
            let data = '';

            checkTimeout.set(StreamApiEndpoint + endpt, res.headers);

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

module.exports = getEndpoint;