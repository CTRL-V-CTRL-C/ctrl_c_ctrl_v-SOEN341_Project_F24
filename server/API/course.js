import express from 'express';
import log from '../logger.js';
import { areEvaluationsReleased, createCourse, releaseEvaluations } from '../database/course.js';
import { db } from '../database/db.js';
import { requireAuth, requireTeacher } from './auth.js';

const courseNamePattern = /^[A-Z]{4,4} ?\d{3,3}$/

const router = express.Router();

async function requireIsInCourse(req, res, next) {
  const courseId = req.params.courseId;

  if (!Number.isInteger(Number.parseInt(courseId))) {
    res.status(400).json({ msg: "Course id needs to be an integer" });
    return;
  }

  try {
    let hasCourse;
    if (req.session.user.isInstructor) {
      hasCourse = await db.query("SELECT course_id FROM courses WHERE instructor_id = $1 AND course_id = $2", [req.session.user.userId, courseId]);
    } else {
      hasCourse = await db.query("SELECT DISTINCT t.course_id FROM teams t JOIN team_members tm ON t.team_id = tm.team_id WHERE tm.user_id = $1 AND t.course_id = $2", [req.session.user.userId, courseId]);
    }

    if (hasCourse.rows.length == 1) {
      next();
    } else {
      res.status(401).json({ msg: "You do not have permission to access this course" });
    }

  } catch (error) {
    log.error(error, `Something went wrong trying to verify ${req.session.user.email} is in course ${courseId}`);
    res.status(500).json({ msg: "Something went wrong trying to perform that action with the course, please try again later" });
  }
}

// creating a course in the database
router.post("/create", requireAuth, requireTeacher, async (req, res, next) => {
  let courseName = req.body.courseName;
  const instructorID = req.session.user.userId;
  if (!courseName && typeof courseName !== 'string') {
    res.status(400).json({ error: "The name of the course should be provided and should be a string" });
    next();
    return;
  }
  courseName = courseName.toUpperCase().normalize("NFKC");
  if (!courseNamePattern.test(courseName)) {
    res.status(400).json({ error: "The name of the course should be in the forma: ABCD 123" });
    next();
    return;
  }
  const result = await createCourse(db, instructorID, courseName);
  if (result instanceof Error) {
    res.status(500).json({ msg: result.message });
  } else {
    res.json({ courseID: result });
  }
  next();
});

router.get("/get-courses", requireAuth, async (req, res) => {
  try {
    let courseQuery;
    if (req.session.user.isInstructor) {
      courseQuery = await db.query("SELECT course_id, course_name FROM courses JOIN users ON instructor_id = user_id WHERE user_id = $1", [req.session.user.userId]);
    } else {
      courseQuery = await db.query("SELECT c.course_id, course_name FROM courses c JOIN teams t ON c.course_id = t.course_id JOIN team_members tm ON t.team_id = tm.team_id WHERE tm.user_id = $1", [req.session.user.userId]);
    }

    res.status(200).json(courseQuery.rows);

  } catch (error) {
    log.error(error, `Something went wrong trying to fetch courses for user ${req.session.user.email}`);
    res.status(500).json({ msg: "Something went wrong trying to get your courses, please try again later" });
  }
});

router.get("/get-students/:courseId", requireAuth, requireIsInCourse, async (req, res) => {
  const courseId = req.params.courseId;
  try {
    if (!req.session.user.isInstructor) {
      res.status(401).json({ msg: "You do not have permission to get the students for this course" });
      return;
    }
    let studentQuery = await db.query("SELECT f_name, l_name, school_id, email, u.user_id FROM courses c JOIN teams t ON c.course_id = t.course_id JOIN team_members tm ON t.team_id = tm.team_id JOIN users u ON tm.user_id = u.user_id WHERE c.course_id = $1", [courseId]);
    res.status(200).json(studentQuery.rows);

  } catch (error) {
    log.error(error, `Something went wrong trying to get all the students in a course for ${req.session.user.email}`);
    res.status(500).json({ msg: "Something went wrong trying to get your students, please try again later" });
  }
});

router.post("/release-evaluations/:courseId", requireAuth, requireTeacher, requireIsInCourse, async (req, res, next) => {
  let courseId = req.params.courseId;
  let released = await areEvaluationsReleased(db, courseId);
  if (released instanceof Error) {
    res.status(500).json({ msg: released.message });
    next();
    return;
  } else if (released) {
    res.status(400).json({ msg: `The evaluations have already been released for this course` });
    next();
    return;
  }
  const result = await releaseEvaluations(db, courseId);
  if (result instanceof Error) {
    res.status(500).json({ msg: result.message });
    next();
  } else {
    res.status(200).json({ msg: "Evaluations have been successfully released" });
    next();
  }
});

router.get("/are-evaluations-released/:courseId", requireAuth, requireIsInCourse, async (req, res, next) => {
  let courseId = req.params.courseId;
  let released = await areEvaluationsReleased(db, courseId);
  if (released instanceof Error) {
    res.status(500).json({ msg: released.message });
    next();
    return;
  }

  res.status(200).json({ released });
  next();
  return;

});


export { router, requireIsInCourse };