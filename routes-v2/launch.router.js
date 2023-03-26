const router = require('express').Router();


const latest = require ('./launch/latest');
router.get('/', latest);

const list = require('./launch/list');
router.get('/list', list);

const next = require('./launch/next');
router.get('/next', next);

const raw = require('./launch/raw');
router.get('/raw', raw);


module.exports = router;