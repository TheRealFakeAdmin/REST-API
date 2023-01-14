const router = require('express').Router()

let motd = (req, res) => {
    res.send(`Check out the next launch using the API <a href="/api/launch/next">here</a>!`);
}

let logr = (req, res) => {
    console.log(req.headers);
    motd(req, res);
}

router.all('/', (req, res) => {
    console.log(req.headers);
})

router.get('/api', motd);

module.exports = router;