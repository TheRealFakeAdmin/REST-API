/**
 * @swagger
 * /v2/translate/{tolng}/{sntnce}:
 *   get:
 *     summary: Translates a sentence from English to a specified target language using DeepL.
 *     description: >
 *       This endpoint translates the provided sentence (passed as a URL-encoded parameter) from English to the target language.
 *       The target language is specified by the `tolng` parameter. It utilizes the DeepL API to perform the translation.
 *     parameters:
 *       - in: path
 *         name: tolng
 *         required: true
 *         schema:
 *           type: string
 *         description: The target language code (e.g., "fr" for French, "de" for German).
 *       - in: path
 *         name: sntnce
 *         required: true
 *         schema:
 *           type: string
 *         description: The sentence to translate (must be URI encoded if it contains special characters).
 *     responses:
 *       200:
 *         description: Successful translation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 language:
 *                   type: object
 *                   properties:
 *                     from:
 *                       type: string
 *                       description: The source language (always "en" for this endpoint).
 *                     to:
 *                       type: string
 *                       description: The target language code.
 *                 resp:
 *                   type: object
 *                   description: The translation result returned by DeepL.
 *                   properties:
 *                     text:
 *                       type: string
 *                       description: The translated text.
 *                     detected_source_language:
 *                       type: string
 *                       description: The detected source language of the input sentence.
 *             examples:
 *               example:
 *                 value:
 *                   language:
 *                     from: "en"
 *                     to: "fr"
 *                   resp:
 *                     text: "Bonjour, comment ça va?"
 *                     detected_source_language: "EN"
 */


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
