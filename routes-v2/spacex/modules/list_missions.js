const https = require('https');

/**
 * @description List all missions currently in the SpaceX API (not all are present)
 * 
 * @param {Object.<boolean>} [optional]
 * @param {Boolean} [optional.all]
 * @param {Boolean} [optional.first]
 * @param {Boolean} [optional.next]
 * @param {Boolean} [optional.final]
 */
const requestMissionsList = async function (optional) {
    const url = `https://content.spacex.com/api/spacex-website/launches-page-tiles`;

    if (optional?.all == true){}
    else
    if (optional?.first == true){}
    else
    if (optional?.next == true){}
    else
    if (optional?.final == true){};

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
                        let resp = JSON.parse(data);
                        resolve({error: null, data: resp});
                    } catch (e) {
                        resolve({error: e, data: data});
                    }
                })
            }
        )

    });
}

const listMissions = async function (optional) {
    return await requestMissionsList(optional);
}

module.exports = listMissions;