const listMissions = require('./modules/list_missions'),

getMissionIdFromLink = (link) => {
    const match = link.match(/missionId=([^&]+)/);
    return match ? match[1] : null;
},

formatResponse = (missions) => {
    const statusMap = new Map(),
        missionIdMap = new Map(),
        dateMap = new Map();

    // Populate maps
    missions.forEach(mission => {
        // Add missionId value
        const missionId = getMissionIdFromLink(mission.link);
        mission.missionId = missionId;


        // Index by status
        if (!statusMap.has(mission.status)) {
            statusMap.set(mission.status, []);
        }
        statusMap.get(mission.status).push(mission);

        // Index by missionId
        if (missionId) {
            missionIdMap.set(missionId, mission);
        }

        // Index by date
        if (!dateMap.has(mission.date)) {
            dateMap.set(mission.date, []);
        }
        dateMap.get(mission.date).push(mission);
    });

    return {
        statusMap,
        missionIdMap,
        dateMap
    }
},

list = async (req, res) => {
    const resp = await listMissions(),
        {statusMap, missionIdMap, dateMap} = formatResponse(resp.data),
        status = req.query["status"],
        missionId = req.query["missionId"];


    res.send({status: "work_in_progress", debug: {
        upcoming: statusMap.get("upcoming"),
        missionId: missionIdMap.get("starship-flight-5"),
        date: dateMap.get("2024-10-13")
    }});
}

module.exports = list;
