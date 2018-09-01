/**
 *
 * Test Util
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 */

import * as fs from 'fs';
import * as path from 'path';
import { Connection } from 'typeorm';

export class TestUtil {

    private static lstDBTables = [
        'student',
        'user',
    ];

    /**
     * Drop All Tables
     * @param {object} connection
     * @return {boolean}
     */
    static async dropAllTables(connection: Connection): Promise<boolean> {
        const queryRunner = connection.createQueryRunner();

        for (const table of this.lstDBTables) {
            await queryRunner.dropTable(table);
        }

        return true;
    }

}