import express from "express";
import { createTeam } from "../database/API.js";
import { db } from "../database/db.js";

const router = express.Router()

router.route("/create")
    .post(async (req, res, next) => {
        const teamName = req.body.teamName;
        const members = req.body.members;
        const courseID = req.body.courseID;
        const result = await createTeam(db, courseID, teamName, members);
        if (result instanceof Error) {
            res.status(400).json({ error: result });
        } else {
            res.json({ created: true });
        }
        next();
    });



export { router }