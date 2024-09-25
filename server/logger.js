import pino from 'pino'
import dotenv from 'dotenv'
dotenv.config()

const targets = [
    {
        level: "info",
        target: 'pino/file',
        options: { destination: './app.log' }
    }
];

if (!process.env.PROD) {
    const testLog = {
        level: "debug",
        target: 'pino-pretty'
    }
    targets.push(testLog)
}

const log = pino(pino.transport({
    targets
}))

export default log;