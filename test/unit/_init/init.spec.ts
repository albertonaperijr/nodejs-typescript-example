/**
 *
 * Init Test
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

require('dotenv/config');
import 'reflect-metadata';
import 'mocha';

import { CommonUtil } from '../../../src/util/CommonUtil';

import { createDbConnection } from '../../../src/config/db/DatabaseProviders';

describe('Init', () => {

    before(async () => {
        // Do nothing
    });

    it('should create a database connection', async () => {

        // Create db connection
        await createDbConnection(true);

        // Populate tables | TEST DATA
        await CommonUtil.populateTables();

    });

});