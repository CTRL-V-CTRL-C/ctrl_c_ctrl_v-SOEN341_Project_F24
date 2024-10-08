import express from "express";
import { createTeam } from "../database/API.js";
import { db } from "../database/db.js";

const router = express.Router()

router.route("/create")
    .post(async (req, res, next) => {
        const teamName = req.body.teamName;
        const members = req.body.members;
        const result = await createTeam(db, teamName, members);
        if (result) {
            res.json({ created: true });
        } else {
            res.status(400).json({ created: false });
        }
        next();
    });



export { router }