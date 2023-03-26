/**
 * Parses data sent back from RocketLaunch.Live, returns full result
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Object} resp 
 * @returns
 */
function parseRaw (req, res, resp) {
    resp.API_IS_DEPRECATED = "NOT FOR PUBLIC USE. Version 1 endpoints are being rewritten/reworked as Version 2 for faster response times. This endpoint has been upgraded and it is highly recommended to switch to using Version 2 in all existing and future projects. See /api/v2/launch/raw";
    return resp;
}


module.exports = parseRaw;