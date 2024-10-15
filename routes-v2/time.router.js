const router = require('express').Router();

const sync = require('./time/sync');

router.get('/sync', sync);

module.exports = router;
