/**
 * @swagger
 * components:
 *   schemas:
 *     Launch:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The unique ID of the launch.
 *         cospar_id:
 *           type: string
 *         sort_date:
 *           type: string
 *         name:
 *           type: string
 *         provider:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             name:
 *               type: string
 *             slug:
 *               type: string
 *         vehicle:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             name:
 *               type: string
 *             company_id:
 *               type: number
 *             slug:
 *               type: string
 *         pad:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             name:
 *               type: string
 *             location:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 name:
 *                   type: string
 *                 state:
 *                   type: string
 *                 statename:
 *                   type: string
 *                 country:
 *                   type: string
 *                 slug:
 *                   type: string
 *         missions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *         mission_description:
 *           type: string
 *         launch_description:
 *           type: string
 *         win_open:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         t0:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         win_close:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         est_date:
 *           type: object
 *           properties:
 *             month:
 *               type: integer
 *             day:
 *               type: integer
 *             year:
 *               type: integer
 *             quarter:
 *               type: integer
 *         date_str:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               text:
 *                 type: string
 *         slug:
 *           type: string
 *         weather_summary:
 *           type: string
 *           nullable: true
 *         weather_temp:
 *           type: string
 *           nullable: true
 *         weather_condition:
 *           type: string
 *           nullable: true
 *         weather_wind_mph:
 *           type: string
 *           nullable: true
 *         weather_icon:
 *           type: string
 *           nullable: true
 *         weather_updated:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         quicktext:
 *           type: string
 *         media:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               media_url:
 *                 type: string
 *               youtube_vidid:
 *                 type: string
 *               featured:
 *                 type: boolean
 *               ldfeatured:
 *                 type: boolean
 *               approved:
 *                 type: boolean
 *         result:
 *           type: number
 *         suborbital:
 *           type: boolean
 *         modified:
 *           type: string
 *           format: date-time
 *
 * /v2/launch/:
 *   get:
 *     summary: Returns information about upcoming rocket launches. (Data by RocketLaunch.Live)
 *     description: >
 *       Returns a string sentence by default. When the query parameter `type=json` is provided,
 *       returns detailed launch information. Optionally, setting `twitch` to "true", "on", or "1"
 *       will provide a more compact format. Note that this endpoint may also return a currently in progress launch.
 *       (Data by RocketLaunch.Live)
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Set to "json" to receive a JSON response.
 *       - in: query
 *         name: twitch
 *         schema:
 *           type: string
 *         description: When set to "true", "on", or "1", returns a more compact format.
 *     responses:
 *       200:
 *         description: A string sentence or a JSON object with launch details.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: string
 *                 - $ref: '#/components/schemas/Launch'
 *
 * /v2/launch/list:
 *   get:
 *     summary: Returns a list of the next 25 launches. (Data by RocketLaunch.Live)
 *     description: >
 *       Returns an array of launch names in the format "Falcon 9 - SPHEREx & PUNCH - 2025-03-11T03:10:00.000Z".
 *       If a valid launch name is provided via the `name` query parameter, returns the detailed information for that specific launch.
 *       When the `name` parameter is used, the same queries as in the `/` endpoint (such as `type` and `twitch`) are also available.
*        (Data by RocketLaunch.Live)
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: A launch name (URI encoded) to retrieve detailed launch info.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Set to "json" to receive a JSON response.
 *       - in: query
 *         name: twitch
 *         schema:
 *           type: string
 *         description: When set to "true", "on", or "1", returns a more compact format.
 *     responses:
 *       200:
 *         description: An array of launch names or a JSON object with launch details.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     type: string
 *                 - $ref: '#/components/schemas/Launch'
 *
 * /v2/launch/next:
 *   get:
 *     summary: Returns information about the next upcoming launch. (Data by RocketLaunch.Live)
 *     description: >
 *       Similar to the `/` endpoint but only returns launches with a timestamp in the future.
 *       Accepts the same query parameters as `/` (`type` and `twitch`).
 *       (Data by RocketLaunch.Live)
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Set to "json" to receive a JSON response.
 *       - in: query
 *         name: twitch
 *         schema:
 *           type: string
 *         description: When set to "true", "on", or "1", returns a more compact format.
 *     responses:
 *       200:
 *         description: A string sentence or a JSON object with launch details.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: string
 *                 - $ref: '#/components/schemas/Launch'
 *
 * /v2/launch/raw:
 *   get:
 *     summary: This returns the full JSON information of the next 25 launches. (Data by RocketLaunch.Live)
 *     description: Returns the raw JSON response from RocketLaunchLive's API. (Data by RocketLaunch.Live)
 *     responses:
 *       200:
 *         description: Raw JSON data including pagination and an array of launch objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid_auth:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 total:
 *                   type: number
 *                 last_page:
 *                   type: number
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Launch'
 *             examples:
 *               raw:
 *                 value: {"valid_auth": true, "count": 25, "limit": 25, "total": 154, "last_page": 7, "result": [ ... ]}
 */


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