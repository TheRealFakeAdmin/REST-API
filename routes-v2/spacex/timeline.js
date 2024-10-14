const getMission = require('./modules/get_mission'),

hhmmss = /\d\d:\d\d:\d\d/;

toUnixTimestamp = (time) => {

    if (!hhmmss.test(time)) return null;

    const timeRE = hhmmss.exec(time)[0];

    const [hours, minutes, seconds] = timeRE.split(":").map(Number);

    const hoursInMilliseconds = hours * 60 * 60 * 1000;
    const minutesInMilliseconds = minutes * 60 * 1000;
    const secondsInMilliseconds = seconds * 1000;

    return hoursInMilliseconds + minutesInMilliseconds + secondsInMilliseconds;
},

timeline = async (req, res) => {
    try {
    const missionId = req.params["missionId"],
        t0 = new Date(req.query["t0"]),
        t0Bool = !isNaN(t0),
        resp = await getMission(missionId),
        mission = resp.data,
        ary = [];

    if (resp.error !== null) return res.send(resp);

    let preLaunchTimeline = mission?.preLaunchTimeline?.timelineEntries,
    postLaunchTimeline = mission?.postLaunchTimeline?.timelineEntries;

    if (t0Bool) {
        if (hhmmss.test(preLaunchTimeline[0].time)) {
            for (let i in preLaunchTimeline) {
                let time = preLaunchTimeline[i].time,
                    isTime = hhmmss.test(preLaunchTimeline[i].time);

                switch (isTime) {
                    case true:
                        const timeRE = hhmmss.exec(time)[0],
                            t = t0.getTime() - toUnixTimestamp(timeRE);
                        preLaunchTimeline[i].ts = t;
                        preLaunchTimeline[i].iso = new Date(t).toISOString();
                        preLaunchTimeline[i].time = `T-${timeRE}`;
                        break;
                    case false:
                        break;
                }
            }
        }

        if (hhmmss.test(postLaunchTimeline[0].time)) {
            for (let i in postLaunchTimeline) {
                let time = postLaunchTimeline[i].time,
                    isTime = hhmmss.test(postLaunchTimeline[i].time);

                switch (isTime) {
                    case true:
                        const timeRE = hhmmss.exec(time)[0],
                            t = t0.getTime() + toUnixTimestamp(timeRE);
                        postLaunchTimeline[i].ts = t;
                        postLaunchTimeline[i].iso = new Date(t).toISOString();
                        postLaunchTimeline[i].time = `T+${timeRE}`;
                        break;
                    case false:
                        break;
                }
            }
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
    } catch (err) {
        console.error(err);
        res.send([]);
    }
};

module.exports = timeline;