const getMission = require('./modules/get_mission'),

timeline = async function (req, res) {
    const missionId = req.params["missionId"],
    mission = await getMission(missionId),
    ary = [];

    let preLaunchTimeline = mission?.preLaunchTimeline?.timelineEntries,
    postLaunchTimeline = mission?.postLaunchTimeline?.timelineEntries;

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
}

module.exports = timeline;