const https = require('https');

const cache = new Map();

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
                            data: d
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


const getMission = async (missionId, cacheDurationMs=1800000) => { // 30 * 60 * 1000 = 30min
    const currentTime = Date.now();

    // Is missionId in cache and not expired?
    if (cache.has(missionId)) {
        const { data, expirationTime } = cache.get(missionId);
        if (currentTime < expirationTime) {
            // Cache is not stale, return data
            console.log('Returning cached data for missionId:', missionId);
            return { error: null, data };
        } else {
            // Cache is stale, remove it
            cache.delete(missionId);
        }
    }

    // If not in cache, get fresh data
    console.log('Fetching new data for missionId:', missionId);
    const result = await requestMission(missionId);

    // Store the result with expiration ts
    if (!result.error) {
        cache.set(missionId, {
            data: result.data,
            expirationTime: currentTime + cacheDurationMs
        });
    }

    return result;
};


module.exports = getMission;