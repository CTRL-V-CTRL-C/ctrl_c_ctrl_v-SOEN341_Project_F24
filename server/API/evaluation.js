import express from 'express';
import { db } from '../database/db.js';
import { requireAuth, requireStudent, requireTeacher } from './auth.js';
import { createOrUpdateEvaluation, getEvaluation, getEvaluationSummary } from '../database/evaluation.js';
import { areInSameTeam, teachesTeam } from '../database/team.js';
import log from '../logger.js';

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
  const normalizedDetails = req.body.evaluation_details

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

router.get("/get-summary/:teamId", requireAuth, requireTeacher, async (req, res, next) => {
  const goodInstructor = await teachesTeam(db, req.params.teamId, req.session.user.userId);

  if (goodInstructor instanceof Error) {
    res.status(500).json({ msg: goodInstructor.message });
    next();
    return;
  } else if (!goodInstructor) {
    res.status(400).json({ msg: `You must teach the team you are trying to get the evaluations of` });
    next();
    return;
  }

  const result = await getEvaluationSummary(db, req.params.teamId);
  if (result instanceof Error) {
    res.status(500).json({ msg: result.message });
  } else {
    res.status(200).json(result);
  }
  next();
});


export { router };