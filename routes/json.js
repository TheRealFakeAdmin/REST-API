const router = require('express').Router()

let jsonParse = (req, res) => {
    let jp = JSON.parse(req.json.query);
    let jsfy = JSON.stringify(jp, (Number(req.query.tab) || 4));
    res.send(jp);
}

/*let jsonStringify = (req, res) {
    res.send(JSON.stringify(req.query.json));
}*/

router.get('/parse', jsonParse);

//router.get('/stringify', jsonStringify);

module.exports = router;
