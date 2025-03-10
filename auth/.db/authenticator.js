const express = require('express');
const path = require('path');
let realm = "api";
let www_auth = `Newauth realm="${realm}", charset="UTF-8", algorithm="SHA-256", stale="true"`; // FIXME : This needs some more work and research

function authenticator(req, res, next) {
    var authheader = req.headers.authorization;
    console.log(req.headers);

    if (!authheader) {
        var err = 'Error 401 - You are not authenticated!';
        res.setHeader('WWW-Authenticate', www_auth);
        err.status = 401;
        return next(err)
    }

    var auth = new Buffer.from(authheader.split(' ')[1],
    'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    if (user === 'username' && pass === 'password') { // TODO : Use MongoDB database to hold accounts and tokens?
 
        // If Authorized user
        next();
    } else {
        var err = 'Error 401 - You are not authenticated!';
        res.setHeader('WWW-Authenticate', www_auth);
        err.status = 401;
        return next(err);
    }

}

module.exports = (router) => {
    router.use(authenticator);
    router.use(express.static(path.join(__dirname, 'public')));
    return void(0);
}
