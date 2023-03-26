const getLaunches = require('./modules/get_launches');

const raw = async (req, res) => {
    const resp = await getLaunches(res);
    res.json(resp);
}

module.exports = raw;