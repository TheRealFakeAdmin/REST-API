"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var completedEndpts = "/api/v2/launch/";
exports.deprecatedSoon = function (req, res, next) {
    res.setHeader("Deprecated", "Soon not for public use. Version 1 endpoints are being rewritten/reworked as Version 2 for faster response times. Completed rewrites: " + completedEndpts);
    return next();
};
exports.deprecatedReplaced = function (req, res, next) {
    res.setHeader("Deprecated", "NOT FOR PUBLIC USE. Version 1 endpoints are being rewritten/reworked as Version 2 for faster response times. This endpoint has been upgraded and it is highly recommended to switch to using Version 2 in all existing and future projects. Completed rewrites: " + completedEndpts);
    return next();
};
exports.deprecatedFull = function (req, res, next) {
    res.setHeader("Deprecated", "NOT FOR PUBLIC USE. This enpoint has been marked as deprecated as there are no current plans to upgrade it. Version 1 endpoints are being rewritten/reworked as Version 2 for faster response times. Completed rewrites: " + completedEndpts);
    return next();
};
exports.logger = function (req, res, next) {
    console.log(req.headers, req.protocol + '://' + req.get('host') + req.originalUrl);
    return next();
};
/**
 * Adds header for "Endpoint-Version"
 * @param {string | number} version
 * @example setVersion('v2');
 * @returns
 */
exports.setVersion = function (version) {
    var v = String(version);
    return function (req, res, next) {
        res.setHeader("Endpoint-Version", v);
        return next();
    };
};
/**
 * Generates an Express ParamsDictionary
 * @param {string} endpt - Endpoint name [i.e. `launch`]
 * @param {number | string} version - Major version number [i.e. `2`]
 * @returns {string[]}
 */
exports.generateParamsDictionary = function (endpt, version) {
    if (typeof endpt !== 'string')
        throw new TypeError('not a valid string');
    if (!['string', 'number'].includes(typeof version) && !Number.isInteger(Number(version)))
        throw new TypeError('not a valid integer');
    switch (version) {
        case 1:
        case '1': // v1 allowed for no version to be mentioned; this backwards-compatibility will be kept until v2 has fully replaced v1
            return ["/v1/".concat(endpt), "/api/v1/".concat(endpt), "/api/".concat(endpt)];
        default:
            return ["/v".concat(version, "/").concat(endpt), "/api/v".concat(version, "/").concat(endpt)];
    }
};
