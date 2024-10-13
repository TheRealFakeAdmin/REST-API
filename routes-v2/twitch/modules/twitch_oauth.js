/*
 * Author: TheRealFakeAdmin
 * Description: Handles authentication with Twitch
 * Version: 2
 * Created: September 25, 2023
*/

const
    twitchClientId = process.env.TWITCH_CLIENT_ID,
    twitchClientSecret = process.env.TWITCH_CLIENT_SECRET,
    twitchTokenRedirectUri = process.env.TWITCH_TOKEN_REDIRECT_URI;

const validateTwitchOAuth = async (oauth) => {
    const
        twitchValidateUrl = 'https://id.twitch.tv/oauth2/validate',
        twitchValidateInit = {
            method: 'GET',
            headers: {
                'Authorization': `OAuth ${oauth}`
            }
        }

    const twitchValidateRequest = await fetch(twitchValidateUrl, twitchValidateInit);
    return (await twitchValidateRequest.json());
}

const requestTwitchToken = async (code, type=0) => { // 0: Auth Code | 1: Refresh Token
    let codeParam, grantType;
    switch (type) {
        case 0:
            codeParam = 'code';
            grantType = 'authorization_code';
            break;
        case 1:
            codeParam = 'refresh_token';
            grantType = 'refresh_token';
            break;
    }

    const
        twitchTokenParams = `?client_id=${twitchClientId}&client_secret=${twitchClientSecret}&${codeParam}=${code}&grant_type=${grantType}&redirect_uri=${twitchTokenRedirectUri}`,
        twitchTokenUrl = `https://id.twitch.tv/oauth2/token${twitchTokenParams}`,
        twitchTokenInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

    const twitchTokenRequest = await fetch(twitchTokenUrl, twitchTokenInit);

    return (await twitchTokenRequest.json());
}

const router = require('express').Router();

router.get('/authorize', async (req, res) => {
    const
        twitchUserAuthQuery = req.query;

    switch (twitchUserAuthQuery?.error) {
        case "access_denied":
            res.send(`Access Denied: ${twitchUserAuthQuery.replaceAll('+', ' ')}`);
            break;
        case undefined:
            res.send(`Success:\n\t${decodeURIComponent(twitchUserAuthQuery['scope'])}`);
            console.log('Authorizing', twitchUserAuthQuery["scope"], twitchUserAuthQuery["code"]);

            process.env.TWITCH_OAUTH2_SCOPE = twitchUserAuthQuery["scope"];
            process.env.TWITCH_AUTH_CODE = twitchUserAuthQuery["code"];

            const twitchUserTokenResponse = await requestTwitchToken(twitchUserAuthQuery["code"]);console.log('Token Response', twitchUserTokenResponse);

            const twitchUserTokenExpires = twitchUserTokenResponse["expires_in"] * 1000; // Converts expires_in to milliseconds

            process.env.TWITCH_OAUTH2_TOKEN = twitchUserTokenResponse["access_token"];
            process.env.TWITCH_OAUTH2_EXPIRES = Date.now() + twitchUserTokenExpires;
            process.env.TWITCH_OAUTH2_REFRESH_TOKEN = twitchUserTokenResponse["refresh_token"];
            process.env.TWITCH_OAUTH2_TYPE = twitchUserTokenResponse["token_type"];

            setTimeout(()=>{
                requestTwitchToken(process.env.TWITCH_OAUTH2_REFRESH_TOKEN, 1);
            }, twitchUserTokenExpires);

            console.log('Test Token', process.env.TWITCH_OAUTH2_TOKEN, process.env.TWITCH_OAUTH2_REFRESH_TOKEN);

            console.log('Verification', await validateTwitchOAuth(process.env.TWITCH_OAUTH2_TOKEN));
            break;
        default:
            res.send(`Unknown Error: ${twitchUserAuthQuery.replaceAll('+', ' ')}`)
    }
})

router.get('/token', async (req, res) => {
    res.send();
    console.log('Token Returned', req.body, typeof req.body);

    const twitchUserTokenResponse = JSON.parse(req.body);

    const twitchUserTokenExpires = twitchUserTokenResponse["expires_in"] * 1000; // Converts expires_in to milliseconds

    process.env.TWITCH_OAUTH2_TOKEN = twitchUserTokenResponse["access_token"];
    process.env.TWITCH_OAUTH2_EXPIRES = Date.now() + twitchUserTokenExpires;
    process.env.TWITCH_OAUTH2_REFRESH_TOKEN = twitchUserTokenResponse["refresh_token"];
    process.env.TWITCH_OAUTH2_TYPE = twitchUserTokenResponse["token_type"];

    setTimeout(()=>{
        requestTwitchToken(process.env.TWITCH_OAUTH2_REFRESH_TOKEN, 1);
    }, twitchUserTokenExpires);

    console.log(await validateTwitchOAuth(process.env.TWITCH_OAUTH2_TOKEN));
})

module.exports = router;


// const https = require('https');
const
    TokenApiEndpoint = "/oauth2/token",
    TokenApiQuery = `?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    TokenHeaders = {
        'Content-Type'  : 'application/x-www-form-urlencoded',
        'Sec-Fetch-Mode': 'cors',
    },
    twitchClientAuthUrl = `https://id.twitch.tv${TokenApiEndpoint}${TokenApiQuery}`,
    twitchClientAuthInit = {
        method: 'POST',
        headers: TokenHeaders
    };

const updateTwitchClientAuthToken = async () => {
    // const options = {
    //     hostname: 'id.twitch.tv',
    //     port: 443,
    //     path: TokenApiEndpoint + TokenApiQuery,
    //     method: 'POST',
    //     headers: TokenHeaders
    // }

    try {
        // https.get(options, (res) => {
        //     let data = '';
        //     res.on('data', (d) => {
        //         data += d;
        //     });
        //
        //     res.on('end', () => {
        //         data = JSON.parse(data);
        //         //console.log(data["access_token"], data["expires_in"]);
        //         if (res.statusCode === 200) {
        //             process.env.TWITCH_BEARER_TOKEN = data["access_token"];
        //             setTimeout(updateTwitchClientAuthToken, data["expires_in"]);
        //         }
        //     })
        //
        // }).on('error', (e) => {
        //     console.error(e);
        // });

        const twitchClientAuthRequest = await fetch(twitchClientAuthUrl, twitchClientAuthInit);
        if (twitchClientAuthRequest.status === 200) {
            console.log('Client Success');
            const twitchClientAuthResponse = await twitchClientAuthRequest.json();
            process.env.TWITCH_BEARER_TOKEN = twitchClientAuthResponse["access_token"];
            setTimeout(updateTwitchClientAuthToken, twitchClientAuthResponse["expires_in"]);
        } else {
            console.log('Client Error', twitchClientAuthRequest.status, await twitchClientAuthRequest.text());
        }
    } catch (e) {
        console.error(e);
    }
}

updateTwitchClientAuthToken();