const router = require('express').Router(),
random = require('./word/random');

router.get('/:n?', (req, res) => {
    let n = Number(req.params['n']),
    regexp = req.query['regexp'];
    n = (/* !Number.isNaN(n) && Number.isFinite(n) && */ Number.isInteger(n) && n <= 1000 ? n : 1);
    res.send(random(n, regexp));
});

router.get('/format/*', (req, res) => { // a: Adjective, v: Verb, n: Noun, A: Adverb
    res.send(req.params[0].split('/'));
});

module.exports = router;