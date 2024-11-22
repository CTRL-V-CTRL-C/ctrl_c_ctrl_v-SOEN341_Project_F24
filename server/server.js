import express from 'express';
import { router as userRouter } from './API/user.js';
import { router as authRouter } from './API/auth.js';
import { router as courseRouter } from './API/course.js';
import { router as documentsRouter } from './API/document.js';
import { router as teamRouter } from './API/team.js';
import { router as evaluationRouter } from './API/evaluation.js';

const app = express()

app.get("/", (req, res) => {
    res.send('Hello World!')
})

const apiRouter = express.Router();
const jsonConfigs = {
    limit: 50 * 1000, // 50 kb max json limit
}
apiRouter.use(express.json(jsonConfigs));

apiRouter.use("/", authRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/team", teamRouter);
apiRouter.use("/course", courseRouter);
apiRouter.use("/document", documentsRouter);
apiRouter.use("/evaluation", evaluationRouter);

app.use("/api", apiRouter);

export { app }
