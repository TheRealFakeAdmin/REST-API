const { unescape: decodeURIComponent } = require('querystring');

const getQuery = (req, name) => {
    const header = req.header(name);
    let query = req.query[name];

    switch (typeof header === "string") {
        case true:
            return header;
        case false:
            switch (typeof query === "string") {
                case true:
                    return decodeURIComponent(query);
                case false:
                    return undefined;
            }
    }
}

module.exports = getQuery;