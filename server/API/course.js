import express from 'express';
import { db } from '../database/db.js';
import { requireAuth } from './auth.js';
import log from '../logger.js';

const router = express.Router();

const jsonConfigs = {
  limit: 50 * 1000, // 50 kb max json limit
};

router.use(express.json(jsonConfigs));

router.get("/get-courses", requireAuth, async (req, res) => {
  try {
    let courseQuery;
    if (req.session.user.isInstructor) {
      courseQuery = await db.query("SELECT course_id, course_name FROM courses JOIN users ON instructor_id = user_id WHERE user_id = $1", [req.session.user.userId]);
    } else {
      courseQuery = await db.query("SELECT DISTINCT c.course_id, course_name FROM courses c JOIN teams t ON c.course_id = t.course_id JOIN team_members tm ON t.team_id = tm.team_id WHERE tm.user_id = $1", [req.session.user.userId]);
    }

    res.status(200).json(courseQuery.rows);

  } catch (error) {
    log.error(error, `Something went wrong trying to fetch courses for user ${req.session.user.email}`);
    res.status(500).json({ msg: "Something went wrong trying to get your courses, please try again later" });
  }
});

export { router };