const getRndWord = (num, wrds) => {
    const resp = [];
    let n;

    for ( ; num > 0 ; num-- ) {
        n = Math.floor(Math.random() * wrds.length);
        resp.push(wrds[n]);
    }

    return resp;
}

module.exports = getRndWord;