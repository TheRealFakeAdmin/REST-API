const router = require('express').Router()

let motd = (req, res) => {
    res.send(`Check out the next launch using the API <a href="/api/launch/next">here</a>!`);
}

router.get('/', motd);

router.get('/api', motd);

module.exports = router;