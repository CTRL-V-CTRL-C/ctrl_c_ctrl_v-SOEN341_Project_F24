import { app } from "./server.js";
import log from "./logger.js";
import dotenv from 'dotenv'
dotenv.config()


const port = process.env.LOCAL_HOST_PORT;
if (!port) {
    log.error("the LOCAL_HOST_PORT wasn't specified in the environment variables. Are you sure you added it to the .env file");
    process.exit(1);
}

const server = app.listen(port, () => {
    log.info(`Example app listening on port http://localhost:${port}`);
})