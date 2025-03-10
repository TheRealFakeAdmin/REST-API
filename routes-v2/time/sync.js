const debug = require('debug')("app:v2:time:sync");
const Microtime = require('microtime');
const method = 2; // 0, 1, or 2

const getUnixTimeMicroseconds = () => {
    switch (method) {
        case 0:
            const secondsSinceEpoch = Date.now(); // returns milliseconds since Unix epoch
            const [seconds, nanoseconds] = process.hrtime(); // high-precision interval since process started
            return secondsSinceEpoch * 1000 + Math.round(nanoseconds / 1e3); // convert to microseconds
        case 1:
            return Date.now() * 1000;
        default:
            return Microtime.now();
    }
};

const sync = (req, res) => {
    // Extract t0 from query parameters
    const t0 = parseInt(req.query.t0, 10); // t0 is provided in the query string
    const currentTime = getUnixTimeMicroseconds(); // Server time when request is received

    // Calculate time1 as the difference between server time and t0
    const time1 = currentTime - t0; 
    // Capture server time when sending the response
    const time2 = getUnixTimeMicroseconds();

    // Respond with both timestamps
    res.json({ time1, time2 });
};

module.exports = sync;
