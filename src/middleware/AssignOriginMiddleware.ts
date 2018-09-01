/**
 *
 * Assign Origin Middleware
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import { LoggerUtil } from '../util/LoggerUtil';

export const AssignOriginMiddleware = (req, res, next) => {
    const MiddlewareName = 'AssignOriginMiddleware |';

    const origin = req.headers.origin;
    const host = req.headers.host;
    // LoggerUtil.info(MiddlewareName, 'origin :', origin, '| host :', host);

    req.headers.origin = origin || host;
    next();
};