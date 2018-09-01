/**
 *
 * Cors Middleware
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import * as cors from 'cors';

import { LoggerUtil } from '../util/LoggerUtil';

// We currently have to whitelist because when in dev mode,
// dev server and dev client run in different ports.
// TODO: either run dev client and server with same port or switch
// whitelist on only for dev mode.
const environment = process.env.ENVIRONMENT;
const localPort = process.env.PORT;
let corsWhitelist: string[] = [];

switch (environment) {
    case 'local':
        corsWhitelist = [
            'localhost:9001',
            `localhost:${localPort}`,
            'http://localhost:9001',
            `http://localhost:${localPort}`,
        ];
        break;
    case 'staging':
        corsWhitelist = [
            'xxx.xx',
        ];
        break;
    case 'prod':
        corsWhitelist = [
            'xxx.xx',
        ];
        break;
    default:
    // Do nothing
}

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // LoggerUtil.info('CorsMiddleware | origin :', origin);

        const originIsWhitelisted = corsWhitelist.includes(origin);
        callback(null, originIsWhitelisted);

        // if (originIsWhitelisted) {
        //     callback(null, true);
        // } else {
        //     callback(new Error('Unauthorized access'));
        // }
    },
    credentials: true
};

export const CorsMiddleware = cors(corsOptions);