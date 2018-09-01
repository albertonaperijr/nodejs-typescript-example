/**
 *
 * Auth Util
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

// import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { CodeUtil } from './CodeUtil';
import { ConstantUtil } from './ConstantUtil';
import { LoggerUtil } from './LoggerUtil';

import { AuthUtilResponse } from '../interface/response/AuthUtilResponse';

export class AuthUtil {

    // ----------------------------------------------------------------------
    // Data retrieval section
    // ----------------------------------------------------------------------

    // ----------------------------------------------------------------------
    // Module specific section
    // ----------------------------------------------------------------------

    // /**
    //  * Hash Password
    //  * @param {string} password
    //  * @return {string} hashedPassword
    //  */
    // public static async hashPassword(password: string): Promise<string | null> {
    //     const MethodName = 'HashPassword |';
    //     // LoggerUtil.info(MethodName, 'password :', password);

    //     if (!password) {
    //         return null;
    //     }

    //     // Hash password
    //     try {
    //         return await bcrypt.hashSync(password, ConstantUtil.PASSWORD_SALT_ROUNDS);
    //     } catch (error) {
    //         return null;
    //     }
    // }

    // /**
    //  * IsPasswordAndHashPasswordMatch
    //  * @param {string} hashPassword
    //  * @param {string} password
    //  * @return {boolean}
    //  */
    // public static async isPasswordAndHashPasswordMatch(password: string, hashPassword: string): Promise<boolean> {
    //     const MethodName = 'IsPasswordAndHashPasswordMatch |';
    //     // LoggerUtil.info(MethodName, 'password :', password, '| hashPassword :', hashPassword);

    //     if (!password || !hashPassword) {
    //         return false;
    //     }

    //     try {
    //         return await bcrypt.compareSync(password, hashPassword);
    //     } catch (error) {
    //         LoggerUtil.error(MethodName, 'error :', error);
    //         return false;
    //     }
    // }

    /**
     * Generate Auth Token
     * @param {object} payload
     * @return {string} token
     */
    public static async generateAuthToken(payload: any): Promise<string> {
        const MethodName = 'GenerateAuthToken |';
        LoggerUtil.info(MethodName, 'payload :', payload);

        if (!payload) {
            return;
        }

        return new Promise((resolve) => {
            const options = {
                algorithm: 'HS256',
                expiresIn: ConstantUtil.DEFAULT_AUTH_EXPIRATION
            };
            jwt.sign(payload, ConstantUtil.JWT_AUTH_SECRET_KEY, options, (error, token) => {
                LoggerUtil.info(MethodName, 'error :', error, '| token :', token);
                if (error) {
                    return resolve();
                }

                return resolve(token);
            });
        }).then((response: string) => {
            return response;
        });
    }

    /**
     * Verify Token
     * @param {string} token
     * @return {object | null} AuthUtilResponse
     */
    public static async verifyToken(token: string, secretKey: string): Promise<AuthUtilResponse> {
        const MethodName = 'VerifyToken |';
        // LoggerUtil.info(MethodName, 'token :', token, '| secretKey :', secretKey);
        // LoggerUtil.info(MethodName);

        if (!token) {
            return;
        }

        return new Promise((resolve) => {
            jwt.verify(token, secretKey, {
                algorithm: 'HS256'
            }, (error, decoded: AuthUtilResponse) => {
                // LoggerUtil.info(MethodName, 'error :', error, '| decoded :', decoded);
                if (error) {
                    return resolve();
                }

                return resolve(decoded);
            });
        }).then((response: AuthUtilResponse | null) => {
            return response;
        });
    }

    // ----------------------------------------------------------------------
    // Generic method section
    // ----------------------------------------------------------------------

}