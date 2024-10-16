import express from "express";
import { createTeam, deleteTeam, teacherMadeTeam } from "../database/team.js";
import { db } from "../database/db.js";
import { requireAuth, requireTeacher } from "./auth.js";

const router = express.Router()

router.use(requireAuth, requireTeacher);

router.route("/create")
    .post(async (req, res, next) => {
        const teamName = req.body.teamName;
        const members = req.body.members;
        const courseID = req.body.courseID;
        const result = await createTeam(db, courseID, teamName, members);
        if (result instanceof Error) {
            res.status(400).json({ error: result });
        } else {
            res.json({ teamID: result });
        }
        next();
    });

router.route("/delete")
    .post(async (req, res, next) => {
        const teamID = req.body.teamID;
        if (!(await teacherMadeTeam(db, teamID, req.session.user.school_id))) {
            res.status(403).json({ error: "You are not the teacher of that course" });
            next();
            return;
        }
        const result = await deleteTeam(db, teamID);
        if (result instanceof Error) {
            res.status(500).json({ error: "there was an error while deleting the team" });
        } else {
            res.status(200).json({ deleted: true });
        }
    })

export { router }