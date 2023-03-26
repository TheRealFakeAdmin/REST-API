const endPts = new Map();

exports.get = async endPt => {
    const ep = endPt.toLowerCase();
    if (endPts.has(ep)) {
        const j = endPts.get(ep);

        while (Date.now() < j.nextAvailable) {};
        return;
    }
    return;
}

exports.set = (endPt, headers) => {
    const ep = endPt.toLowerCase(),
        dt = new Date().valueOf(),
        rdt = new Date(headers["ratelimit-reset"] * 1000).valueOf(),
        rem = Number(headers["ratelimit-remaining"]),
        lmt = Number(headers["ratelimit-limit"]),
        nxtEvt = Math.max(((rdt - dt) / rem), 1000);

    endPts.set(ep, {
        nextAvailable: (dt + nxtEvt),
        limit: lmt,
        reset: rdt
    })
}