require('dotenv').config();

// const checkTimeout = require('./modules/check_timeout');

const
    twitchClientId = process.env.TWITCH_CLIENT_ID,
    twitchApiHost = "https://api.twitch.tv",
    twitchApiEndpoint = "/helix/";

const getEndpoint = async (endpoint, query) => {
    const
        twitchApiUrl = `${twitchApiHost}${twitchApiEndpoint}${endpoint}${stringifyQuery(query)}`,
        twitchApiInit = {
            method: 'GET',
            headers: {
                'Client-Id': twitchClientId,
                'Authorization': query["ra_type"] === 'oauth' ? `Bearer ${process.env.TWITCH_OAUTH2_TOKEN}` : `Bearer ${process.env.TWITCH_BEARER_TOKEN}`
            }
        };console.debug(twitchApiUrl, twitchApiInit);

    const twitchApiRequest = await fetch(twitchApiUrl, twitchApiInit);
    const twitchApiResponse = await twitchApiRequest.text();

    switch (twitchApiRequest.status) {
        case 200:
            return JSON.parse(twitchApiResponse);
        default:
            return twitchApiResponse;
    }

    // const options = {
    //     hostname: twitchApiHost,
    //     port: 443,
    //     path: twitchApiEndpoint + endpoint + query,
    //     method: 'GET',
    //     headers: {
    //         'Authorization': `Bearer ${process.env.TWITCH_OAUTH2_SCOPE || process.env.TWITCH_BEARER_TOKEN}`,
    //         'Client-Id': twitchClientId
    //     }
    // }
    //
    // await checkTimeout.get(twitchApiEndpoint + endpoint);
    //
    // try {
    //     https.get(options, (res) => {
    //         let data = '';
    //
    //         checkTimeout.set(twitchApiEndpoint + endpoint, res.headers);
    //
    //         res.on('data', (d) => {
    //           data += d;
    //         });
    //
    //         res.on('close', () => {
    //             data = JSON.parse(data);
    //             callback(null, data);
    //         });
    //
    //     }).on('error', (e) => {
    //         callback(e, null);
    //     });
    // } catch (e) {
    //     callback(e, null);
    // }
};

const stringifyQuery = (q) => {
    let query = "?";
    for (let k in q) {
        query += `${k}=${q[k]}&`;
    }
    return query.replace(/[?&]$/, "");
}

module.exports = getEndpoint;