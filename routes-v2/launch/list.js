const getLaunches = require('./modules/get_launches');
const parseLaunch = require('./modules/parse_launch');
const getQuery = require('./modules/get_query');

let lastList = [];

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

function listLoop (resp) {
    let lst = [], t;

    for (v of resp.result) {
        t = new Date(v.t0 || v.win_open);
        lst.push(`${v.vehicle.name} - ${v.name} - ${(!isValidDate(t) || t.valueOf() === 0) ? v.date_str : t.toISOString()}`);
    }

    return lst;
}


// /**
//  * Parses data sent back from RocketLaunch.Live, returns next upcoming launch
//  * @param {Express.Request} req 
//  * @param {Express.Response} res 
//  * @param {Object} resp 
//  * @returns
//  */
// function initialList (req, res, resp) {
//     let lst = listLoop(resp);
//     lastList = lst;

//     return lst;
// }

// function selectList (req, res, resp) {
//     let lst = lastList.length > 0 ? lastList : listLoop(resp);
//         msg = "",
//         nme = req.get('name') != undefined ? req.header('name') : decodeURIComponent(req.query.name);

//     console.debug(nme, lastList);

//     if (!lst.includes(nme)) return `{errors:["Not a valid name"]}`; // Stop if error

//     let v = resp.result[lst.indexOf(nme)];


//     msg = parseSentence(v, msg);
//     if (req.query.tts === "true") msg += `<script>window.speechSynthesis.speak(new SpeechSynthesisUtterance(document.body.innerText))</script>`; // If `?tts=true`, TTS the response.

//     return msg;
// }


const list = async (req, res) => {
    const resp = await getLaunches(),
    name = getQuery(req, "name"),
    type = getQuery(req, "type");
    let lst = [];

    switch (name === undefined) {
        case true: // Empty/No String --- First Run
            lst = listLoop(resp);
            lastList = lst;
            res.send(lst);
            break;
        case false: // String --- Second Run
            lst = lastList.length > 0 ? lastList : listLoop(resp);
            
            if (!lst.includes(name)) return res.json({success: 0, errors: [ "Not a valid name" ]}); // Stop if error

            switch (type) {
                case "json":
                    return res.json(resp.result[lst.indexOf(name)]);
                default:
                    let v = resp.result[lst.indexOf(name)];
                    let msg = parseLaunch(v, undefined, ["on", "true", "1"].includes(req.query["twitch"]));
                    if (req.query.tts === "true") msg += `<script>window.speechSynthesis.speak(new SpeechSynthesisUtterance(document.body.innerText))</script>`; // If `?tts=true`, TTS the response.
                    return res.send(msg);
            }
            // if (["1", "true", "on"].includes(type)) return res.json(resp.result[lst.indexOf(name)]);
            break;
    }
}

module.exports = list;