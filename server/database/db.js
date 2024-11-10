import pg from 'pg'
import fs from 'node:fs'
import dotenv from 'dotenv'
import log from '../logger.js';
dotenv.config()

// all the configs to connect to the production database
const user = process.env.db_user;
const password = process.env.db_password;
const host = process.env.db_host;
const port = process.env.db_port;
const database = process.env.db_database;
const certificate = process.env.db_certificate;

// all the configs to connect to the test database
const test_user = process.env.test_db_user;
const test_password = process.env.test_db_password;
const test_host = process.env.test_db_host;
const test_port = process.env.test_db_port;
const test_database = process.env.test_db_database;
const test_certificate = process.env.test_db_certificate;

let config = undefined;

// connect to prod if in prod else connect to the test
if (process.env.PROD) {
    log.info("Using the production database");
    config = {
        user,
        password,
        host,
        port,
        database,
        application_name: "PROD: PeerCheck",
        ssl: {
            rejectUnauthorized: true,
            ca: certificate,
        },
    };
} else {
    log.info("Using the test database");

    config = {
        user: test_user,
        password: test_password,
        host: test_host,
        port: test_port,
        database: test_database,
        application_name: "DEV: PeerCheck",
        ssl: {
            rejectUnauthorized: true,
            ca: test_certificate,
        },
    };
}

const pool = new pg.Pool(config);

/**
 * queries the database and returns an error if any or the result
 * @param {pg.Pool} db the database to query
 * @param {pg.QueryConfig} query the query to send
 * @param {string?} message the error to be logged if any error occurred
 * @returns {Promise<pg.QueryResult<any> | Error>} an error if any occured or the result
 */
async function queryAndReturnError(db, query, message) {
    try {
        return await db.query(query);
    } catch (error) {
        if (message) {
            log.error(message);
        } else {
            log.error(`there was an error while querying: ${query}`);
        }
        log.error(error);
        return error;
    }
}

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (a) => parseFloat(a));

export { pool as db, queryAndReturnError };