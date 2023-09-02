const parseLaunch = require('./modules/parse_launch');
const getLaunches = require('./modules/get_launches');

const latest = async (req, res) => {
    const resp = (await getLaunches(res)).result[0];

    switch (req.query.type?.toLowerCase()) {
        case "json":
            res.json(resp);
            return void(0);
        default:
            const msg = parseLaunch(resp, undefined, ["on", "true", "1"].includes(req.query["twitch"]));
            res.send(msg);
            return void(0);
    }
}

module.exports = latest;