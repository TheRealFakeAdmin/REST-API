const router = require('express').Router();

router.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
})

const latest = require ('./launch/latest');
router.get('/', latest);

const list = require('./launch/list');
router.get('/list', list);

const next = require('./launch/next');
router.get('/next', next);

const raw = require('./launch/raw');
router.get('/raw', raw);


module.exports = router;