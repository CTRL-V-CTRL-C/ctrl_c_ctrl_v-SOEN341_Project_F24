import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const user = process.env.db_user
const password = process.env.db_password
const host = process.env.db_host
const port = process.env.db_port
const database = process.env.db_database
const certificate = process.env.db_certificate

const config = {
    user,
    password,
    host,
    port,
    database,
    ssl: {
        rejectUnauthorized: true,
        ca: certificate,
    },
};

let client = undefined;
const mockedClient = {
    query: async (query, params) => { console.log(`queried: ${query} with paramas ${params}`) }
}
if (process.env.PROD) {
    client = new pg.Client(config)
    await client.connect()
} else {
    client = mockedClient
}

export { client as db }