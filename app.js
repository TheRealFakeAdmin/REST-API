require('dotenv').config({ override: true });

const path = require('path');

const express = require('express');
const favicon = require('serve-favicon');
const responseTime = require('response-time');

const https = require('https');

const app = express();
const PORT = process.env.PORT || 7378;

process.env.TZ = process.env.TIMEZONE || process.env.TZ;


app.use(express.json());

app.use(favicon(path.join(__dirname, 'pages/favicon.ico')));

app.use(responseTime());

app.use((req, res, next) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    next();
})

app.options('/*', (req, res) => {
    console.log(req.headers);
    res.setHeader("Allow", "GET, POST");
    res.send();
})

app.all('/log', (req, res) => {
    console.log(req.headers, req.protocol + '://' + req.get('host') + req.originalUrl);
    res.status(201).send();
});

// Routes //
const completedEndpts = "/api/v2/launch/";

const deprecatedSoon = (req, res, next) => {
    res.setHeader("Deprecated", "Soon not for public use. Version 1 endpoints are being rewritten/reworked as Version 2 for faster response times. Completed rewrites: " + completedEndpts);
    return next();
}

const deprecatedReplaced = (req, res, next) => {
    res.setHeader("Deprecated", "NOT FOR PUBLIC USE. Version 1 endpoints are being rewritten/reworked as Version 2 for faster response times. This endpoint has been upgraded and it is highly recommended to switch to using Version 2 in all existing and future projects. Completed rewrites: " + completedEndpts);
    return next();
}

const deprecatedFull = (req, res, next) => {
    res.setHeader("Deprecated", "NOT FOR PUBLIC USE. This enpoint has been marked as deprecated as there are no current plans to upgrade it. Version 1 endpoints are being rewritten/reworked as Version 2 for faster response times. Completed rewrites: " + completedEndpts);
    return next();
}

const setVersion = (version) => {
    const v = Number(version);
    switch (typeof v === "string") {
        case true:
            return (req, res, next) => {
                res.setHeader("Endpoint-Version", v);
                return next();
            }
        case false:
            return (req, res, next) => {
                return next();
            }
    }
}


const robots = (req, res) => {
    response.setHeader('Content-Type', 'plain/text');
    response.setHeader('Accept','plain/text');
    res.send("User-agent: *\nDisallow: /");
}
app.get('/robots.txt', robots);

const motd = require('./routes/motd.js');
app.use('/api/v1', deprecatedSoon, motd);


const users = require('./auth/users/user.router');
app.use('/auth/users', users);


const launchRoute = require('./routes/launch.js');
app.use(['/api/launch', '/api/v1/launch'], deprecatedReplaced, launchRoute);


//const test = require('./routes/auth_test.js');
//app.use('/test', test);


const json = require('./routes/json.js');
app.use(['/api/json', '/api/v1/json'], deprecatedFull, json);


const timezones = require('./routes/timezones');
app.use(['/api/timezones', '/api/v1/timezones'], deprecatedFull, timezones);


// const spacexCountdown = require('./routes/spacex_countdown.js');
// app.use('/api/spacex', spacexCountdown);


// Pages //

// const launch_clocks = require('./pages/launch_clocks.js');
// app.use('/launch_clocks', launch_clocks);

// const script = require('./pages/script.router');
// app.get('/script', script);

// Routes V2 //


const motdV2 = require('./routes-v2/motd.router');
app.use([ '/api/v2', '/v2' ], motdV2);


const launch_v2 = require('./routes-v2/launch.router');
app.use([ '/api/v2/launch' , '/v2/launch' ], setVersion("2.0.0"), launch_v2);


const word = require('./routes-v2/word.router');
app.use([ '/api/v2/word', '/v2/word' ], setVersion("0.0.1-dev"), word);


const twitch = require('./routes-v2/twitch.router');
app.use([ '/api/v2/twitch', '/v2/twitch' ], setVersion('0.0.1-dev'), twitch);


const spacex = require('./routes-v2/spacex.router');
app.use([ '/api/v2/spacex', '/v2/spacex' ], setVersion('0.0.1-dev'), spacex);


// End Setup //

const root = require('./pages/root'); // Send non-default error
app.use('/*', root);

const TokenApiEndpoint = "/oauth2/token";
const TokenApiQuery = `?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials&redirect_uri=https://api.trfa.xyz/v2/twitch/log`;
const TokenHeaders = {
    'Content-Type' : 'application/x-www-form-urlencoded'
};

const twitchToken = () => {
    const options = {
        hostname: 'id.twitch.tv',
        port: 443,
        path: TokenApiEndpoint + TokenApiQuery,
        method: 'POST',
        headers: TokenHeaders
    }

    try {
        https.get(options, (res) => {
            let data = '';
            res.on('data', (d) => {
                data += d;
            });

            res.on('end', () => {
                data = JSON.parse(data);
                //console.log(data["access_token"], data["expires_in"]);
                if (res.statusCode === 200) {
                    process.env.TWITCH_BEARER_TOKEN = data["access_token"];
                    setTimeout(twitchToken, data["expires_in"]);
                }
            })
          
        }).on('error', (e) => {
            console.error(e);
        });
    } catch (e) {
        console.error(e);
    }
}

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/v2`);

    twitchToken();
})
