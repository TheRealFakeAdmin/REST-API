/**
 * @swagger
 * /v2/time/sync:
 *   get:
 *     summary: Synchronizes client and server clocks with microsecond precision.
 *     description: >
 *       Accepts a query parameter `t0` representing the client's current timestamp in microseconds.
 *       The endpoint calculates `time1` as the difference between the server's time at request receipt and `t0`,
 *       and `time2` as the server's time when the response is sent.
 *     parameters:
 *       - in: query
 *         name: t0
 *         required: true
 *         schema:
 *           type: integer
 *         description: An integer representing the client's current timestamp in microseconds.
 *     responses:
 *       200:
 *         description: Returns time synchronization details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 time1:
 *                   type: integer
 *                   description: The difference (in microseconds) between the server's time at request receipt and t0.
 *                 time2:
 *                   type: integer
 *                   description: The server's timestamp (in microseconds) when sending the response.
 *             examples:
 *               example:
 *                 value: {"time1": 95752, "time2": 1741570390050754}
 */

const router = require('express').Router();

const sync = require('./time/sync');

router.get('/sync', sync);

module.exports = router;
