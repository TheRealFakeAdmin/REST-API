const { getAdjective, getNoun, getVerb, getAdverb } = require('./modules/query');

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

const random = (num=1, regexp) => {
    const resp = [];
    let n = 0;

    for ( ; num > 0 ; num-- ) {
        n = getRndInteger(0, 3);

        switch (n) {
            case 0:
                resp.push(getAdjective(undefined, regexp)[0]);
                break;
            case 1:
                resp.push(getNoun(undefined, regexp)[0]);
                break;
            case 2:
                resp.push(getVerb(undefined, regexp)[0]);
                break;
            case 3:
                resp.push(getAdverb(undefined, regexp)[0])
        }
    }

    return resp;
}

module.exports = random;