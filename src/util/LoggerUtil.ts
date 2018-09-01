/**
 *
 * Logger Util
 *
 * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr. *
 * * * * * * * * * * * * * * * *
 *
 */

import { ConstantUtil } from './ConstantUtil';

const pino = require('pino');
// const pretty = pino.pretty();
// pretty.pipe(process.stdout);

const Pino = pino({
    name: ConstantUtil.APP_NAME,
    safe: true,
    prettyPrint: true,
    pipe: process.stdout
});
// }, pretty);

export class LoggerUtil {

    // ----------------------------------------------------------------------
    // Module specific section
    // ----------------------------------------------------------------------

    /**
     * Info
     */
    static info(arg1: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, arg6?: any, arg7?: any, arg8?: any, arg9?: any, arg10?: any, arg11?: any, arg12?: any, arg13?: any, arg14?: any, arg15?: any): void {
        switch (true) {
            case arg15 !== undefined:
                Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15);
                break;
            case arg14 !== undefined:
                Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14);
                break;
            case arg13 !== undefined:
                Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13);
                break;
            case arg12 !== undefined:
                Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12);
                break;
            case arg11 !== undefined:
                Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11);
                break;
            case arg10 !== undefined:
                Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);
                break;
            case arg9 !== undefined:
                Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
                break;
            case arg8 !== undefined:
                Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
                break;
            case arg7 !== undefined:
                Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7);
                break;
            case arg6 !== undefined:
                Pino.info(arg1, arg2, arg3, arg4, arg5, arg6);
                break;
            case arg5 !== undefined:
                Pino.info(arg1, arg2, arg3, arg4, arg5);
                break;
            case arg4 !== undefined:
                Pino.info(arg1, arg2, arg3, arg4);
                break;
            case arg3 !== undefined:
                Pino.info(arg1, arg2, arg3);
                break;
            case arg2 !== undefined:
                Pino.info(arg1, arg2);
                break;
            case arg1 !== undefined:
                Pino.info(arg1);
                break;
            default:
            // Do nothing
        }
    }

    /**
     * Error
     */
    static error(arg1: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, arg6?: any, arg7?: any, arg8?: any, arg9?: any, arg10?: any, arg11?: any, arg12?: any, arg13?: any, arg14?: any, arg15?: any): void {
        switch (true) {
            case arg15 !== undefined:
                Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15);
                break;
            case arg14 !== undefined:
                Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14);
                break;
            case arg13 !== undefined:
                Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13);
                break;
            case arg12 !== undefined:
                Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12);
                break;
            case arg11 !== undefined:
                Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11);
                break;
            case arg10 !== undefined:
                Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);
                break;
            case arg9 !== undefined:
                Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
                break;
            case arg8 !== undefined:
                Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
                break;
            case arg7 !== undefined:
                Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7);
                break;
            case arg6 !== undefined:
                Pino.error(arg1, arg2, arg3, arg4, arg5, arg6);
                break;
            case arg5 !== undefined:
                Pino.error(arg1, arg2, arg3, arg4, arg5);
                break;
            case arg4 !== undefined:
                Pino.error(arg1, arg2, arg3, arg4);
                break;
            case arg3 !== undefined:
                Pino.error(arg1, arg2, arg3);
                break;
            case arg2 !== undefined:
                Pino.error(arg1, arg2);
                break;
            case arg1 !== undefined:
                Pino.error(arg1);
                break;
            default:
            // Do nothing
        }
    }

    /**
     * Debug Info
     */
    static debugInfo(arg1: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, arg6?: any, arg7?: any, arg8?: any, arg9?: any, arg10?: any, arg11?: any, arg12?: any, arg13?: any, arg14?: any, arg15?: any): void {
        if (process.env.SHOW_DEBUG_LOGS) {
            switch (true) {
                case arg15 !== undefined:
                    Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15);
                    break;
                case arg14 !== undefined:
                    Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14);
                    break;
                case arg13 !== undefined:
                    Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13);
                    break;
                case arg12 !== undefined:
                    Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12);
                    break;
                case arg11 !== undefined:
                    Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11);
                    break;
                case arg10 !== undefined:
                    Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);
                    break;
                case arg9 !== undefined:
                    Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
                    break;
                case arg8 !== undefined:
                    Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
                    break;
                case arg7 !== undefined:
                    Pino.info(arg1, arg2, arg3, arg4, arg5, arg6, arg7);
                    break;
                case arg6 !== undefined:
                    Pino.info(arg1, arg2, arg3, arg4, arg5, arg6);
                    break;
                case arg5 !== undefined:
                    Pino.info(arg1, arg2, arg3, arg4, arg5);
                    break;
                case arg4 !== undefined:
                    Pino.info(arg1, arg2, arg3, arg4);
                    break;
                case arg3 !== undefined:
                    Pino.info(arg1, arg2, arg3);
                    break;
                case arg2 !== undefined:
                    Pino.info(arg1, arg2);
                    break;
                case arg1 !== undefined:
                    Pino.info(arg1);
                    break;
                default:
                // Do nothing
            }
        }
    }

    /**
     * Debug Error
     */
    static debugError(arg1: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, arg6?: any, arg7?: any, arg8?: any, arg9?: any, arg10?: any, arg11?: any, arg12?: any, arg13?: any, arg14?: any, arg15?: any): void {
        if (process.env.SHOW_DEBUG_LOGS) {
            switch (true) {
                case arg15 !== undefined:
                    Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15);
                    break;
                case arg14 !== undefined:
                    Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14);
                    break;
                case arg13 !== undefined:
                    Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13);
                    break;
                case arg12 !== undefined:
                    Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12);
                    break;
                case arg11 !== undefined:
                    Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11);
                    break;
                case arg10 !== undefined:
                    Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);
                    break;
                case arg9 !== undefined:
                    Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
                    break;
                case arg8 !== undefined:
                    Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
                    break;
                case arg7 !== undefined:
                    Pino.error(arg1, arg2, arg3, arg4, arg5, arg6, arg7);
                    break;
                case arg6 !== undefined:
                    Pino.error(arg1, arg2, arg3, arg4, arg5, arg6);
                    break;
                case arg5 !== undefined:
                    Pino.error(arg1, arg2, arg3, arg4, arg5);
                    break;
                case arg4 !== undefined:
                    Pino.error(arg1, arg2, arg3, arg4);
                    break;
                case arg3 !== undefined:
                    Pino.error(arg1, arg2, arg3);
                    break;
                case arg2 !== undefined:
                    Pino.error(arg1, arg2);
                    break;
                case arg1 !== undefined:
                    Pino.error(arg1);
                    break;
                default:
                // Do nothing
            }
        }
    }

}