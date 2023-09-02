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
    res.setHeader("X-Robots-Tag", "noindex, nofollow").removeHeader('x-powered-by');
    next();
})

app.options('/*', (req, res) => {
    console.log(req.headers);
    res.setHeader("Allow", "GET, POST");
    res.send();
})

const {deprecatedFull, deprecatedReplaced, deprecatedSoon, setVersion, generateParamsDictionary, logger} = require('./modules/v2/handlers');

app.all([ '/log/*', '/log' ], logger, setVersion('0.0.2-dev'), (req, res) => {
    res.status(204).send();
});

const robots = require('./pages/robots');
app.get('/robots.txt', logger, robots);


// Routes //


const motd = require('./routes/motd');
app.use([ '/api/v1', '/v1' ], deprecatedSoon, motd);


const users = require('./auth/users/user.router');
app.use('/auth/users', users);


const launchRoute = require('./routes/launch.js');
app.use(generateParamsDictionary('launch', 1), deprecatedReplaced, launchRoute);


//const test = require('./routes/auth_test.js');
//app.use('/test', test);


const json = require('./routes/json');
app.use(generateParamsDictionary('json', 1), deprecatedFull, json);


const timezones = require('./routes/timezones');
app.use(generateParamsDictionary('timezones', 1), deprecatedFull, timezones);


// const spacexCountdown = require('./routes/spacex_countdown.js');
// app.use('/api/spacex', spacexCountdown);


// Pages //

// const launch_clocks = require('./pages/launch_clocks.js');
// app.use('/launch_clocks', launch_clocks);

// const script = require('./pages/script.router');
// app.get('/script', script);

const launches_page = require('./pages/launches.page');
app.use('/launches', launches_page);

// Routes V2 //


const motdV2 = require('./routes-v2/motd.router');
app.use([ '/api/v2', '/v2' ], motdV2);


const launch_v2 = require('./routes-v2/launch.router');
app.use(generateParamsDictionary('launch', 2), setVersion("2.0.1"), launch_v2);


const word = require('./routes-v2/word.router');
app.use(generateParamsDictionary('word', 2), setVersion("0.0.1-dev"), word);


// const twitch = require('./routes-v2/twitch.router');
// app.use(generateParamsDictionary('twitch', 2), setVersion('0.0.1-dev'), twitch);


const spacex = require('./routes-v2/spacex.router');
app.use(generateParamsDictionary('spacex', 2), setVersion('0.0.2-dev'), spacex);


const translate = require('./routes-v2/translate.router');
app.use(generateParamsDictionary('translate', 2), setVersion('0.0.1-dev'), translate);


// End Setup //

const root = require('./pages/root'); // Send non-default error
app.use('/*', root);

// const TokenApiEndpoint = "/oauth2/token";
// const TokenApiQuery = `?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials&redirect_uri=https://api.trfa.xyz/v2/twitch/log`;
// const TokenHeaders = {
//     'Content-Type' : 'application/x-www-form-urlencoded'
// };

// const twitchToken = () => {
//     const options = {
//         hostname: 'id.twitch.tv',
//         port: 443,
//         path: TokenApiEndpoint + TokenApiQuery,
//         method: 'POST',
//         headers: TokenHeaders
//     }

//     try {
//         https.get(options, (res) => {
//             let data = '';
//             res.on('data', (d) => {
//                 data += d;
//             });

//             res.on('end', () => {
//                 data = JSON.parse(data);
//                 //console.log(data["access_token"], data["expires_in"]);
//                 if (res.statusCode === 200) {
//                     process.env.TWITCH_BEARER_TOKEN = data["access_token"];
//                     setTimeout(twitchToken, data["expires_in"]);
//                 }
//             })
          
//         }).on('error', (e) => {
//             console.error(e);
//         });
//     } catch (e) {
//         console.error(e);
//     }
// }

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/v2`);

    // twitchToken();
})
