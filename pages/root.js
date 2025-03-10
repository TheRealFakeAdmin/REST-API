const router = require('express').Router();


const root = (req, res) => {
    // Nothing to see here
    res.status(204).send();
}


router.get('/', root);


module.exports = router;
