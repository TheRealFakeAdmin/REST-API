const router = require('express').Router();

const deepl = require('deepl-node'),
translator = new deepl.Translator(process.env.DEEPL_KEY);

router.get('/:tolng/:sntnce', async (req, res) => {
    const [tolng, sntnce] = [req.params['tolng'], req.params['sntnce']];

    const resp = await translator.translateText(sntnce, null, tolng);
    res.send({
        language: {
            from: 'en',
            to: tolng
        },
        resp: resp
    });
});


module.exports = router;