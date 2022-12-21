const express = require('express');
const router = express.Router();
require('../auth/authenticator.js')(router);

router.get('/', (req, res) => {
    res.send('Hello World!!!');
})

module.exports = router;