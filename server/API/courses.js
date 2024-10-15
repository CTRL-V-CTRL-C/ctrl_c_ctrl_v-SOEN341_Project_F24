import express from 'express';
import { createCourse, createUser } from '../database/API.js';
import { db } from '../database/db.js';
import { requireAuth, requireTeacher } from './auth.js';

const router = express.Router();

// creating a course in the database
router.route("/create", requireAuth, requireTeacher)
    .post(async (req, res, next) => {
        const courseName = req.body.courseName;
        const instructorID = req.session.user.user_id;
        if (!(courseName && instructorID)) {
            res.status(400).json({ error: "The name of the course is not provided or you are not logged in" });
            next();
            return;
        }
        const result = await createCourse(db, instructorID, courseName);
        if (result instanceof Error) {
            res.status(400).json({ error });
        } else {
            res.json({ courseID: result });
        }
        next();
    });

export { router }