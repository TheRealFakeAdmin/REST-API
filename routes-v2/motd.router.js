const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Welcome to the new REST API V2. Check out the new launch API <a href="/api/v2/launch">here</a>!');
})

module.exports = router;