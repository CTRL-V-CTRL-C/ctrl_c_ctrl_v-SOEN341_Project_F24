import pino from 'pino'
import dotenv from 'dotenv'
import path from 'node:path'
dotenv.config()

const targets = [
    {
        level: "info",
        target: 'pino/file',
        options: { destination: path.join(import.meta.dirname, '..', 'app.log') }
    }
];

if (!process.env.PROD) {
    const testLog = {
        level: "trace",
        target: 'pino-pretty'
    }
    targets.push(testLog)
}

const log = pino({
    level: 'trace',
    transport: {
        targets
    }
})

export default log;