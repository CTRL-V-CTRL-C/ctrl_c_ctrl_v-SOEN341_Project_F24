import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const server = app.listen(port, () => {
    const port = process.env.LOCAL_HOST_PORT
    if (!port) {
        console.error("the LOCAL_HOST_PORT wasn't specified in the environment variables. Are you sure you added it to the .env file");
        server.close()
        return
    }
    console.log(`Example app listening on port http://localhost:${port}`)
})