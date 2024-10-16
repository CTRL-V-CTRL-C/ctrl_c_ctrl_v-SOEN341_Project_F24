import express from 'express';
import { db } from '../database/db.js';
import { requireAuth } from './auth.js';
import { requireIsInCourse } from './course.js';
import log from '../logger.js';

const router = express.Router();

const jsonConfigs = {
  limit: 50 * 1000, // 50 kb max json limit
};

router.use(express.json(jsonConfigs));

router.get("/get-teams/:courseId", requireAuth, requireIsInCourse, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    let teamQuery;
    if (req.session.user.isInstructor) {
      teamQuery = await db.query("SELECT t.team_id, t.team_name, json_agg(json_build_object('f_name',f_name,'l_name',l_name,'user_id',u.user_id,'school_id',school_id,'email',email)) members \
        FROM teams t \
        JOIN team_members tm ON t.team_id = tm.team_id \
        JOIN users u ON tm.user_id = u.user_id \
        WHERE t.course_id = $1 GROUP BY t.team_id;", [courseId]);
    } else {
      teamQuery = await db.query("SELECT t.team_name, json_agg(json_build_object('f_name',f_name,'l_name',l_name)) members \
        FROM teams t \
        JOIN team_members tm ON t.team_id = tm.team_id \
        JOIN users u ON tm.user_id = u.user_id \
        WHERE t.course_id = $1 AND NOT(t.team_id IN \
          (SELECT team_id FROM team_members WHERE user_id = $2)) \
        GROUP BY t.team_id", [courseId, req.session.user.userId]);
    }

    res.status(200).json(teamQuery.rows);

  } catch (error) {
    log.error(error, `Something went wrong trying to fetch the teams for user ${req.session.user.email}`);
    res.status(500).json({ msg: "Something went wrong trying to get the teams, please try again later" });
  }
});

router.get("/get-my-team/:courseId", requireAuth, requireIsInCourse, async (req, res) => {
  const courseId = req.params.courseId;
  try {
    if (req.session.user.isInstructor) {
      res.status(401).json({ msg: "As an instructor, you do not have a team" });
      return;
    }
    let teamQuery = await db.query("SELECT t.team_id, t.team_name, json_agg(json_build_object('f_name',f_name,'l_name',l_name,'user_id',u.user_id,'email',email)) members \
        FROM teams t \
        JOIN team_members tm ON t.team_id = tm.team_id \
        JOIN users u ON tm.user_id = u.user_id \
        WHERE t.course_id = $1 AND t.team_id IN \
          (SELECT team_id FROM team_members WHERE user_id = $2) \
        GROUP BY t.team_id", [courseId, req.session.user.userId]);
    res.status(200).json(teamQuery.rows[0]);

  } catch (error) {
    log.error(error, `Something went wrong trying to get all the students in a course for ${req.session.user.email}`);
    res.status(500).json({ msg: "Something went wrong trying to get your students, please try again later" });
  }
});

export { router };