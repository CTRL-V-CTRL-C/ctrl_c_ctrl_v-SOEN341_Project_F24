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
            ca: fs.readFileSync(certificate).toString(),
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
            ca: fs.readFileSync(test_certificate).toString(),
        },
    };
}


let client = new pg.Pool(config);
const mockedClient = {
    query: async (query, params) => { log.info(`queried: ${JSON.stringify(query)} with paramas ${params}`) },
    end: async () => { log.info("database client disconnected"); }
};

try {
    await client.connect();
} catch (error) {
    log.warn(`There was an error while connecting to the database`);
    log.warn(error);
    if (process.env.PROD) {
        log.error("The server was started in production and couldn't connect to the database, shutting down");
        process.exit(1);
    } else {
        log.info("Using the mocked client")
        client = mockedClient;
    }
}

export { client as db }