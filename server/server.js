import express from 'express';
import { router as userRouter } from './API/user.js';
import { router as authRouter } from './API/auth.js';
import { router as teamsRouter } from './API/team.js';
import { router as coursesRouter } from './API/course.js'

const app = express()

app.use("/api", authRouter);

app.get("/", (req, res) => {
    res.send('Hello World!')
})

const apiRouter = express.Router();
const jsonConfigs = {
    limit: 50 * 1000, // 50 kb max json limit
}
apiRouter.use(express.json(jsonConfigs));

apiRouter.use("/user", userRouter)
apiRouter.use("/teams", teamsRouter);
apiRouter.use("/courses", coursesRouter)

app.use("/api", apiRouter);

export { app }
