import pg from 'pg'
import fs from 'node:fs'
import dotenv from 'dotenv'
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
    console.info("Using the production database");
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
    console.info("Using the test database");

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


let client = new pg.Client(config);
const mockedClient = {
    query: async (query, params) => { console.log(`queried: ${JSON.stringify(query)} with paramas ${params}`) },
    end: async () => { console.log("database client disconnected"); }
};

try {
    await client.connect();
} catch (error) {
    console.warn(`There was an error while connecting to the database`);
    console.warn(error);
    if (process.env.PROD) {
        console.error("The server was started in production and couldn't connect to the database, shutting down");
        process.exit(1);
    } else {
        console.info("Using the mocked client")
        client = mockedClient;
    }
}

export { client as db }