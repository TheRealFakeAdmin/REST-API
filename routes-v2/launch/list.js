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
    nme = getQuery(req, "name"),
    jsn = getQuery(req, "type");
    let lst = [];

    switch (nme === undefined) {
        case true: // Empty/No String --- First Run
            lst = listLoop(resp);
            lastList = lst;
            res.send(lst);
            break;
        case false: // String --- Second Run
            lst = lastList.length > 0 ? lastList : listLoop(resp);
            
            if (!lst.includes(nme)) return res.json({success: 0, errors: [ "Not a valid name" ]}); // Stop if error
            if (["1", "true", "on"].includes(jsn)) return res.json(resp.result[lst.indexOf(nme)]);

            let v = resp.result[lst.indexOf(nme)];
            let msg = parseLaunch(v);
            if (req.query.tts === "true") msg += `<script>window.speechSynthesis.speak(new SpeechSynthesisUtterance(document.body.innerText))</script>`; // If `?tts=true`, TTS the response.

            res.send(msg);
            break;
    }
}

module.exports = list;