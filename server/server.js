import express from 'express'
import { router as userRouter } from './API/user.js'

const app = express()

app.get("/", (req, res) => {
    res.send('Hello World!')
})

app.use("/user", userRouter)

export { app }
