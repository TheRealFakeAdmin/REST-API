const parseLaunch = require('./modules/parse_launch');
const getLaunches = require('./modules/get_launches');

const latest = async (req, res) => {
    const resp = (await getLaunches(res)).result[0];

    switch (req.query.type?.toLowerCase()) {
        case "json":
            res.json(resp);
            return void(0);
        default:
            const msg = parseLaunch(resp);
            res.send(`<a href="${req.get('host').replace(/\:[0-9]{1,5}/, "")}:8888/launch_clocks/launch_info.html?until=${new Date(resp.t0 || resp.win_open).toString()}&show-t=1&12hr=1&tz=EST">${msg}</a>`);
            return void(0);
    }
}

module.exports = latest;