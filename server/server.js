import express from 'express';
import { router as userRouter } from './API/user.js';
import { router as authRouter } from './API/auth.js';

const app = express()

app.use("/api", authRouter);

app.get("/", (req, res) => {
    res.send('Hello World!')
})

app.use("/api/user", userRouter)

export { app }
