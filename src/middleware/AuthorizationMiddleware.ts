/**
 *
 * Authorization Middleware
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import { AuthUtil } from '../util/AuthUtil';
import { ConstantUtil } from '../util/ConstantUtil';
import { LoggerUtil } from '../util/LoggerUtil';

import { AuthUtilResponse } from '../interface/response/AuthUtilResponse';

export const AuthorizationMiddleware = async (req, res, next) => {
    const MiddlewareName = 'AuthorizationMiddleware |';
    LoggerUtil.debugInfo(MiddlewareName, 'authorization :', req.headers.authorization);

    req.user = null;

    if (!req.headers.authorization) {
        return next();
    }

    const splittedAuthorization = req.headers.authorization.split(ConstantUtil.AUTHORIZATION_HEADER_PREFIX);

    if (splittedAuthorization.length <= 1) {
        return next();
    }

    const token = splittedAuthorization[1];
    const decoded: AuthUtilResponse = await AuthUtil.verifyToken(token, ConstantUtil.JWT_AUTH_SECRET_KEY);
    LoggerUtil.info(MiddlewareName, 'decoded :', decoded);

    if (decoded) {
        req.user = {
            id: decoded.uid || ConstantUtil.DEFAULT_CURRENT_USER_ID,
            accessLevel: decoded.accessLevel
        };
    }

    next();
};