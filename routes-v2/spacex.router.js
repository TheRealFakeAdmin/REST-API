const router = require('express').Router(),

timeline = require('./spacex/timeline');

router.get('/timeline/:missionId', timeline);

module.exports = router;
