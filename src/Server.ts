/**
 *
 * Server
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import * as compression from 'compression';
import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as helmet from 'helmet';
import * as http from 'http';
import * as path from 'path';
import { useExpressServer } from 'routing-controllers';

import { AssignOriginMiddleware } from './middleware/AssignOriginMiddleware';
import { AuthorizationMiddleware } from './middleware/AuthorizationMiddleware';
import { CorsMiddleware } from './middleware/CorsMiddleware';

import { createDbConnection } from './config/db/DatabaseProviders';

import { AuthUtil } from './util/AuthUtil';
import { CodeUtil } from './util/CodeUtil';
import { CommonUtil } from './util/CommonUtil';
import { ConstantUtil } from './util/ConstantUtil';
import { LoggerUtil } from './util/LoggerUtil';

import { StudentController } from './controller/StudentController';
import { UserController } from './controller/UserController';

export class Server {

    private PORT = Number(process.env.PORT) || 9001;

    // Set app to be of type express.Application
    private app: express.Application;
    private httpServer: http.Server;

    constructor() {
        this.start();
    }

    /**
     * Start Server
     */
    private async start(): Promise<boolean> {
        LoggerUtil.info('Starting server...');

        try {
            await createDbConnection();
            LoggerUtil.info('Success creating DB connection');
        } catch (error) {
            LoggerUtil.error('Error creating DB connection | error :', error);
            return false;
        }

        /**
         * Populate tables | TEST DATA
         * NOTE: Test only
         */
        if (process.env.ENVIRONMENT !== 'prod') {
            await CommonUtil.populateTables();
        }

        this.app = express();
        await this.config();
        await this.routes();
        await this.serverListen();

        return true;
    }

    /**
     * Application Config
     */
    private async config(): Promise<boolean> {

        // this.app.use(favicon(path.resolve('./assets/images/favicon.png')));

        // Express middleware
        this.app.use(compression());
        this.app.use(helmet());

        // Custom Middlewares
        // this.app.use(AssignOriginMiddleware);
        // this.app.use(CorsMiddleware);
        // this.app.use(AuthorizationMiddleware);

        return true;
    }

    /**
     * Application routes
     */
    private async routes(): Promise<boolean> {

        // Routing Controller | REST
        useExpressServer(this.app, {
            routePrefix: '/api',
            controllers: [
                StudentController,
                UserController,
            ],
        });

        /**
         * Send all other requests
         */
        this.app.get('*', (req, res) => {
            res.statusCode = CodeUtil.HTTP_STATUS_CODE_NOT_FOUND;
            res.json({
                message: 'Not Found'
            });
        });

        return true;
    }

    /**
     * Listen
     */
    private async serverListen(): Promise<boolean> {

        this.httpServer = http.createServer(this.app);

        this.httpServer.listen({
            port: this.PORT,
            host: 'localhost',
        });
        this.httpServer.on('listening', () => {
            LoggerUtil.info(`Server is listening on http://localhost:${this.PORT}`);
        });
        this.httpServer.on('error', (error: NodeJS.ErrnoException) => {
            if (error.syscall !== 'listen') {
                throw error;
            }

            const bind = (typeof this.PORT === 'string') ? 'Pipe ' + this.PORT : 'Port ' + this.PORT;

            switch (error.code) {
                case 'EACCES':
                    LoggerUtil.error(`${bind} requires elevated privileges`);
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    LoggerUtil.error(`${bind} is already in use`);
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });

        return true;
    }

}
