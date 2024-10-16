import express from 'express';
import { router as userRouter } from './API/user.js';
import { router as authRouter } from './API/auth.js';
import { router as courseRouter } from './API/course.js';
import { router as teamRouter } from './API/team.js';

const app = express()

app.use("/api", authRouter);
app.use("/api/course", courseRouter);
app.use("/api/team", teamRouter);

app.get("/", (req, res) => {
    res.send('Hello World!')
})

app.use("/api/user", userRouter)

export { app }
