/**
 *
 * Code Manager Util
 *
 * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr. *
 * * * * * * * * * * * * * * * *
 *
 */

import { CodeUtil } from './CodeUtil';
import { LoggerUtil } from './LoggerUtil';

export class CodeManagerUtil {

    // ----------------------------------------------------------------------
    // Data retrieval section
    // ----------------------------------------------------------------------

    // ----------------------------------------------------------------------
    // Module specific section
    // ----------------------------------------------------------------------

    /**
     * Get Http Status Code
     * @param {number} returnCode
     * @return {number} statusCode
     */
    public static getHttpStatusCode(returnCode: number): number {
        const MethodName = 'GetHttpStatusCode |';
        LoggerUtil.info(MethodName, 'returnCode :', returnCode);

        if (!returnCode) {
            return CodeUtil.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR;
        }

        if (returnCode === CodeUtil.INVALID_PARAMETER) {
            return CodeUtil.HTTP_STATUS_CODE_BAD_REQUEST;
        }

        if (returnCode === CodeUtil.UNAUTHORIZED_ACCESS) {
            return CodeUtil.HTTP_STATUS_CODE_FORBIDDEN;
        }

        let statusCode: number = CodeUtil.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR;
        const returnCodeString = returnCode.toString();
        const statusID = Number(returnCodeString.substring(0, 1));
        const processID = Number(returnCodeString.substring(3, 5));

        // Check if statusID is success
        if (statusID === CodeUtil.RETURN_CODE_STATUS_ID_SUCCESS) {
            statusCode = CodeUtil.HTTP_STATUS_CODE_OK;
        } else if (statusID === CodeUtil.RETURN_CODE_STATUS_ID_ERROR) {
            statusCode = CodeUtil.HTTP_STATUS_CODE_EXPECTATION_FAILED;
        }

        return statusCode;
    }

    // ----------------------------------------------------------------------
    // Generic method section
    // ----------------------------------------------------------------------

}