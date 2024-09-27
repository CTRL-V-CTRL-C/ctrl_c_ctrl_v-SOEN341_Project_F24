import express from 'express';
import { router as userRouter } from './API/user.js';
import { router as authRouter } from './API/auth.js';

const app = express()

app.use("", authRouter);

app.get("/", (req, res) => {
    res.send('Hello World!')
})

app.use("/user", userRouter)

export { app }
