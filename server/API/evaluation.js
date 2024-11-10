import express from 'express';
import { db } from '../database/db.js';
import { requireAuth, requireStudent, requireTeacher, requireTeacherMadeTeam } from './auth.js';
import { createOrUpdateEvaluation, getEvaluation, getTeamEvaluationSummary, getEvaluationDetails, getCourseEvaluationSummary } from '../database/evaluation.js';

import { areInSameTeam, teacherMadeTeam, userIsInTeam } from '../database/team.js';
import log from '../logger.js';
import { requireIsInCourse } from './course.js';

const router = express.Router();

const criteriaPattern = /^(COOPERATION|CONCEPTUAL CONTRIBUTION|PRACTICAL CONTRIBUTION|WORK ETHIC)$/;

/**
 * Create a new evaluation or update an old evaluation for a given student in a team
 * @param {express.Request} req the request
 * @param {int} req.body.team_id The team id that both students are part of
 * @param {int} req.body.user_id The the id of the user being evaluated
 * @param {array} req.body.evaluation_details The array of evaluation details
 * @param {express.Response} res the response
 * @param {express.NextFunction} next the function to call the next middleware
 */
router.post("/evaluate", requireAuth, requireStudent, async (req, res, next) => {
  const normalizedDetails = req.body.evaluation_details;
  const goodEvaluation = new Map();
  goodEvaluation.set("COOPERATION", 0);
  goodEvaluation.set("CONCEPTUAL CONTRIBUTION", 0);
  goodEvaluation.set("PRACTICAL CONTRIBUTION", 0);
  goodEvaluation.set("WORK ETHIC", 0);

  let goodUsers = await areInSameTeam(db, req.body.team_id, req.body.user_id, req.session.user.userId);
  if (goodUsers instanceof Error) {
    res.status(500).json({ msg: goodUsers.message });
    next();
    return;
  } else if (!goodUsers) {
    res.status(400).json({ msg: `You must be in the same team as the person you are trying to evaluate` });
    next();
    return;
  }

  for (let i = 0; i < normalizedDetails.length; i++) {
    normalizedDetails[i].criteria = normalizedDetails[i].criteria.normalize("NFKC").toLocaleUpperCase();
    normalizedDetails[i].comment ? normalizedDetails[i].comment.normalize("NFKC") : "";

    if (!criteriaPattern.test(normalizedDetails[i].criteria)) {
      log.warn(`Student ${req.session.user.userId} evaluated ${req.body.user_id} with an invalid criteria: ${normalizedDetails[i].criteria}`);
      res.status(400).json({ msg: `Invalid evalution criteria. Received: ${normalizedDetails[i].criteria}` });
      next();
      return;
    }

    if (normalizedDetails[i].rating < 1 || normalizedDetails[i].rating > 5) {
      log.warn(`Student ${req.session.user.userId} evaluated ${req.body.user_id} with an invalid rating: ${normalizedDetails[i].rating}`);
      res.status(400).json({ msg: `Invalid evaluation rating. Received: ${normalizedDetails[i].rating}` });
      next();
      return;
    }

    goodEvaluation.set(normalizedDetails[i].criteria, goodEvaluation.get(normalizedDetails[i].criteria) + 1);
  }

  for (const element of goodEvaluation.values()) {
    if (element != 1) {
      log.warn(`Student ${req.session.user.userId} evaluated ${req.body.user_id} with an invalid evaluation: duplicate or missing criteria`);
      res.status(400).json({ msg: `Invalid evaluation. Duplicate or missing criteria.` });
      next();
      return;
    }
  }

  const result = await createOrUpdateEvaluation(db, req.session.user.userId, req.body.user_id, req.body.team_id, req.body.evaluation_details);
  if (result instanceof Error) {
    res.status(500).json({ msg: result.message });
  } else {
    res.status(200).json({ msg: `Evaluation was successful` });
  }
  next();
});

/**
 * Get the evaluation details for a given student in a team
 * @param {express.Request} req the request
 * @param {int} req.params.teamId The team id that both students are part of
 * @param {int} req.params.eavluateeId The the id of the user being evaluated
 * @param {express.Response} res the response
 * @param {express.NextFunction} next the function to call the next middleware
 */
router.get("/get-my-evaluation/:teamId/:evaluateeId", requireAuth, requireStudent, async (req, res, next) => {
  let goodUsers = await areInSameTeam(db, req.params.teamId, req.params.evaluateeId, req.session.user.userId);
  if (goodUsers instanceof Error) {
    res.status(500).json({ msg: goodUsers.message });
    next();
    return;
  } else if (!goodUsers) {
    res.status(400).json({ msg: `You must be in the same team as the person you are to get your evaluation of` });
    next();
    return;
  }
  const result = await getEvaluation(db, req.session.user.userId, req.params.evaluateeId, req.params.teamId);
  if (result instanceof Error) {
    res.status(500).json({ msg: result.message });
  } else {
    res.status(200).json(result);
  }
  next();
});

router.get("/get-team-summary/:teamId", requireAuth, requireTeacher, requireTeacherMadeTeam, async (req, res, next) => {

  const result = await getTeamEvaluationSummary(db, req.params.teamId);
  if (result instanceof Error) {
    res.status(500).json({ msg: result.message });
  } else {
    res.status(200).json(result);
  }
  next();
});

router.get("/get-course-summary/:courseId", requireAuth, requireTeacher, requireIsInCourse, async (req, res, next) => {
  const result = await getCourseEvaluationSummary(db, req.params.courseId);
  if (result instanceof Error) {
    res.status(500).json({ msg: result.message });
  } else {
    res.status(200).json(result);
  }
  next();
});

router.get("/get-team-details/:teamId/:schoolId", requireAuth, requireTeacher, requireTeacherMadeTeam, async (req, res, next) => {
  const inTeam = await userIsInTeam(db, req.params.schoolId, req.params.teamId);
  if (!inTeam) {
    res.status(400).json({ msg: "The user you are trying to access is not in that team" });
    next();
    return;
  }
  const result = await getEvaluationDetails(db, req.params.teamId, req.params.schoolId);
  if (result instanceof Error) {
    res.status(500).json({ msg: result.message });
  } else {
    res.status(200).json(result);
  }
  next();
});


export { router };