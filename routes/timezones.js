const router = require('express').Router();
const moment = require('moment-timezone');

moment.tz.setDefault("America/New_York");

/**
 * Get timezone data (offset and dst)
 * src: https://github.com/tamaspap/timezones
 * 
 *  Inspired by: http://goo.gl/E41sTi
 *
 * @returns {{offset: number, dst: number}}
 */
function getTimeZoneData(req, res) {
	try {
		let newYork = moment.tz(req.query.date, "America/New_York"),
			losAngeles = newYork.clone().tz("America/Los_Angeles");
	
		res.send(newYork.format() + " (America/New_York)<br>" + losAngeles.format() + " (America/Los_Angeles)" );
	} catch (e) {
		res.status(500).send("500 : Internal Server Error");
	}
}

router.get("/:date", getTimeZoneData);

module.exports = router;