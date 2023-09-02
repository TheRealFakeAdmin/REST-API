const https = require('https');

const requestMission = async function (missionId) {
    const url = `https://content.spacex.com/api/spacex-website/missions/${missionId}`;

    return new Promise ((resolve) => {
        let data = "";

        https.get(
            url,
            (rsp) => {
                rsp.on('data', d => {
                    data += d.toString('utf8');
                });
    
                rsp.on('end', () => {
                    try {
                        const d = JSON.parse(data),
                        resp = {
                            error: null,
                            data: data
                        };
                        resolve(resp);
                    } catch (e) {
                        resolve({error: e, data: data});
                    }
                })
            }
        )
    });
}

const getMission = async function (missionId) {
    return await requestMission(missionId);
}

module.exports = getMission;