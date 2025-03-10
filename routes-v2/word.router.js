/**
 * @swagger
 * /v2/word/{n}?:
 *   get:
 *     summary: Returns an array of random words.
 *     description: >
 *       Generates a list of random words. The optional path parameter `n` specifies the number of words to generate (default is 1, maximum is 1000).
 *       A query parameter `regexp` can be provided to filter the generated words based on a regular expression.
 *     parameters:
 *       - in: path
 *         name: n
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of words to generate. Must be an integer up to 1000.
 *       - in: query
 *         name: regexp
 *         required: false
 *         schema:
 *           type: string
 *         description: A regular expression pattern to filter the generated words.
 *     responses:
 *       200:
 *         description: An array of random words.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *             examples:
 *               example:
 *                 value: ["happy", "run", "sunshine"]
 *
 * /v2/word/format/{format}:
 *   get:
 *     summary: Parses a format string into its components.
 *     description: >
 *       Splits the provided format string into an array based on the '/' delimiter.
 *       The format string should contain tokens where:
 *         - 'a' represents an adjective,
 *         - 'v' represents a verb,
 *         - 'n' represents a noun, and
 *         - 'A' represents an adverb.
 *     parameters:
 *       - in: path
 *         name: format
 *         required: true
 *         schema:
 *           type: string
 *         description: The format string (e.g., "a/v/n/A").
 *     responses:
 *       200:
 *         description: An array of format tokens.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *             examples:
 *               example:
 *                 value: ["a", "v", "n", "A"]
 */

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
