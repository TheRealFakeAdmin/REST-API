const getMission = require('./modules/get_mission'),

toUnixTimestamp = (time) => {
    const hhmmss = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

    if (!hhmmss.test(time)) return null;

    const [hours, minutes, seconds] = time.split(":").map(Number);

    const hoursInMilliseconds = hours * 60 * 60 * 1000;
    const minutesInMilliseconds = minutes * 60 * 1000;
    const secondsInMilliseconds = seconds * 1000;

    return hoursInMilliseconds + minutesInMilliseconds + secondsInMilliseconds;
},

timeline = async (req, res) => {
    const missionId = req.params["missionId"],
        t0 = new Date(req.query["t0"]),
        t0Bool = !isNaN(t0),
        resp = await getMission(missionId),
        mission = resp.data,
        ary = [];

    if (resp.error !== null) return res.send(resp);

    let preLaunchTimeline = mission?.preLaunchTimeline?.timelineEntries,
    postLaunchTimeline = mission?.postLaunchTimeline?.timelineEntries;

    const hhmmss = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

    if (hhmmss.test(preLaunchTimeline[0].time)) {
        for (let i in preLaunchTimeline) {
            let time = preLaunchTimeline[i].time,
                isTime = hhmmss.test(preLaunchTimeline[i].time);

            switch (t0Bool && isTime) {
                case true:
                    const t = t0.getTime() - toUnixTimestamp(time);
                    preLaunchTimeline[i].ts = t;
                    preLaunchTimeline[i].iso = new Date(t).toISOString();
                    break;
                case false:
                    break;
            }
            preLaunchTimeline[i].time = `T-${preLaunchTimeline[i].time}`;
        }
    }

    if (hhmmss.test(postLaunchTimeline[0].time)) {
        for (let i in postLaunchTimeline) {
            let time = postLaunchTimeline[i].time,
                isTime = hhmmss.test(postLaunchTimeline[i].time);

            switch (t0Bool && isTime) {
                case true:
                    const t = t0.getTime() + toUnixTimestamp(time);
                    postLaunchTimeline[i].ts = t;
                    postLaunchTimeline[i].iso = new Date(t).toISOString();
                    break;
                case false:
                    break;
            }
            postLaunchTimeline[i].time = `T+${postLaunchTimeline[i].time}`;
        }
    }

    if (Array.isArray(preLaunchTimeline))
        ary.push(...preLaunchTimeline);

    if (Array.isArray(postLaunchTimeline))
        ary.push(...postLaunchTimeline);

    ary.sort((a, b) => {
        const an = Number(a.time),
        bn = Number(b.time);
        switch (Number.isNaN(an) && Number.isNaN(bn)) {
            case true:
                return;
            case false:
                return an > bn;
        }
    })

    res.send(ary);
};

module.exports = timeline;