/**
 *
 * DB Connection
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import { createConnection } from 'typeorm';

import { ConstantUtil } from '../../util/ConstantUtil';

import { SnakeNamingStrategy } from '../naming-strategy/SnakeCaseNamingStrategy';

import { Student } from '../../entity/Student';
import { User } from '../../entity/User';

export const createDbConnection = async function (dropSchema?: boolean) {
    return createConnection({
        type: 'mysql',
        host: ConstantUtil.MYSQL_HOST,
        port: ConstantUtil.MYSQL_PORT,
        database: ConstantUtil.MYSQL_DATABASE,
        username: ConstantUtil.MYSQL_USERNAME,
        password: ConstantUtil.MYSQL_PASSWORD,
        namingStrategy: new SnakeNamingStrategy(),
        logging: process.env.ENVIRONMENT === 'prod' ? false : 'all',
        entities: [
            Student,
            User,
        ],

        // Note: This is for testing purposes
        // Always make these false in production
        // dropSchema: process.env.ENVIRONMENT === 'prod' ? false : dropSchema,
        synchronize: process.env.ENVIRONMENT !== 'prod',
    });
};
