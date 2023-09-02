import { NextFunction, Request, Response } from "express";

const completedEndpts = "/api/v2/launch/";

exports.deprecatedSoon = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Deprecated", "Soon not for public use. Version 1 endpoints are being rewritten/reworked as Version 2 for faster response times. Completed rewrites: " + completedEndpts);
    return next();
}

exports.deprecatedReplaced = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Deprecated", "NOT FOR PUBLIC USE. Version 1 endpoints are being rewritten/reworked as Version 2 for faster response times. This endpoint has been upgraded and it is highly recommended to switch to using Version 2 in all existing and future projects. Completed rewrites: " + completedEndpts);
    return next();
}

exports.deprecatedFull = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Deprecated", "NOT FOR PUBLIC USE. This enpoint has been marked as deprecated as there are no current plans to upgrade it. Version 1 endpoints are being rewritten/reworked as Version 2 for faster response times. Completed rewrites: " + completedEndpts);
    return next();
}

exports.logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers, req.protocol + '://' + req.get('host') + req.originalUrl);
    return next();
}

/**
 * Adds header for "Endpoint-Version"
 * @param {string | number} version 
 * @example setVersion('v2');
 * @returns 
 */
exports.setVersion = (version: string|number) => {
    const v = String(version);
    return (req: Request, res: Response, next: NextFunction) => {
        res.setHeader("Endpoint-Version", v);
        return next();
    }
}

/**
 * Generates an Express ParamsDictionary
 * @param {string} endpt - Endpoint name [i.e. `launch`]
 * @param {number | string} version - Major version number [i.e. `2`]
 * @returns {string[]}
 */
exports.generateParamsDictionary = (endpt: string, version: string|number): string[] => {
    if (typeof endpt !== 'string') throw new TypeError('not a valid string');
    if (!['string', 'number'].includes(typeof version) && !Number.isInteger(Number(version))) throw new TypeError('not a valid integer');
    switch (version) {
        case 1:
        case '1': // v1 allowed for no version to be mentioned; this backwards-compatibility will be kept until v2 has fully replaced v1
            return [ `/v1/${endpt}`, `/api/v1/${endpt}`, `/api/${endpt}` ];
        default:
            return [ `/v${version}/${endpt}`, `/api/v${version}/${endpt}` ];
    }
}
