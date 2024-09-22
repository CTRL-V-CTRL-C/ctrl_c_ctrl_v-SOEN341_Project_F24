import pg from 'pg'

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


const client = new pg.Client(config);
// TODO: connect with the parameters
// await client.connect()

export { client as db }