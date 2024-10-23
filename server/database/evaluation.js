import pg from 'pg'
import log from '../logger.js'


const getEvaluationQuery = {
  name: "get-evaluation",
  text: "SELECT evaluation_id FROM evaluations WHERE team_id = $1 AND evaluator_id = $2 AND evaluatee_id = $3;",
  values: []
}


/**
 * creates or updates an evaluation and all its details in the database
 * @param {pg.Pool} db the database
 * @param {int} evaluatorId the id of the student evaluating
 * @param {int} evaluateeId the id of the student being evaluated
 * @param {int} teamId the name of the course
 * @param {array} evaluationDetails an array of evaluation details that contain a criteria and its rating
 * @returns {Promise<Error | string>}
 */
async function createOrUpdateEvaluation(db, evaluatorId, evaluateeId, teamId, evaluationDetails) {
  const createEvaluationQuery = {
    name: "create-evaluation",
    text: "INSERT INTO evaluations (team_id, evaluator_id, evaluatee_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING evaluation_id;",
    values: [teamId, evaluatorId, evaluateeId]
  };

  const createOrUpdateEvaluationDetails = {
    name: "create-or-update-evalutation-details",
    text: "INSERT INTO evaluation_details (evaluation_id, criteria, rating, comment) VALUES ($1, $2, $3, $4) ON CONFLICT (evaluation_id, criteria) DO UPDATE SET rating = excluded.rating, comment = excluded.comment;",
    values: []
  };

  try {

    let result = await db.query(createEvaluationQuery);
    let evaluationId;
    if (!result.rows[0] || !result.rows[0].evaluation_id) {
      getEvaluationQuery.values = [teamId, evaluatorId, evaluateeId];
      result = await db.query(getEvaluationQuery);
    }
    evaluationId = result.rows[0].evaluation_id;

    for (const detail of evaluationDetails) {
      createOrUpdateEvaluationDetails.values = [evaluationId, detail.criteria, detail.rating, detail.comment];
      await db.query(createOrUpdateEvaluationDetails);
    }

    return evaluationId;
  } catch (error) {
    log.error(`There was an error while ${evaluatorId} was evaluating ${evaluateeId} in team ${teamId}`);
    log.error(error);
    return error;
  }
}

export { createOrUpdateEvaluation }