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
    const time2 = getUnixTimeMicroseconds();
    res.json({ time2, time3: getUnixTimeMicroseconds() });
    
    // const { t1 } = req.body; // Client sends t1 in the request body

    // const currentTime = getUnixTimeMicroseconds();
    // const t2 = currentTime - t1; // Calculate time difference on the server
    // const t3 = getUnixTimeMicroseconds(); // When the server responds

    res.json({ time2: t2, time3: t3 });
}

module.exports = sync;
