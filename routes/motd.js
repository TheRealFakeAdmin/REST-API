const router = require('express').Router()

let motd = (req, res) => {
    res.send(`Check out the next launch using the API <a href="/api/launch/next">here</a>!`);
}

let logr = (req, res, next) => {
    console.log(req.headers);
    next(req, res);
}

router.options('/*', (req, res) => {
    res.setHeader("Allow", "GET, POST");
    res.send();
})

// router.all('/', (req, res) => {
//     res.status(301);
//     res.send(`<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url='/api'" /></head><body><p>Redirecting <a href="/api">here</a></p></body></html>`)
// })

router.get('/', motd);

module.exports = router;