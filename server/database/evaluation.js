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
 * @returns {Promise<Error | int>}
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

/**
 * creates or updates an evaluation and all its details in the database
 * @param {pg.Pool} db the database
 * @param {int} evaluatorId the id of the student evaluating
 * @param {int} evaluateeId the id of the student being evaluated
 * @param {int} teamId the name of the course
 * @returns {Promise<Error | Array<JSON>>}
 */
async function getEvaluation(db, evaluatorId, evaluateeId, teamId) {
  const createEvaluationQuery = {
    name: "get-evaluation-details",
    text: "SELECT criteria, rating, comment FROM evaluation_details WHERE evaluation_id = $1;",
    values: []
  };

  try {

    getEvaluationQuery.values = [teamId, evaluatorId, evaluateeId];
    let result = await db.query(getEvaluationQuery);

    if (result.rows.length == 0) {
      //If no evaluation is made, send back empty evaluation
      return [
        { criteria: "COOPERATION", rating: 0, comment: "" },
        { criteria: "CONCEPTUAL CONTRIBUTION", rating: 0, comment: "" },
        { criteria: "PRACTICAL CONTRIBUTION", rating: 0, comment: "" },
        { criteria: "WORK ETHIC", rating: 0, comment: "" }
      ]

    }

    let evaluationId = result.rows[0].evaluation_id;
    createEvaluationQuery.values = [evaluationId];

    result = await db.query(createEvaluationQuery);
    return result.rows;

  } catch (error) {
    log.error(`There was an error while ${evaluatorId} was getting the evaluation for ${evaluateeId} in team ${teamId}`);
    log.error(error);
    return error;
  }
}

async function getEvaluationDetails(db, teamId) {
  const query = {
    name: `get-evaluation-summary ${teamId}`,
    text: `
WITH team_reviews AS (
  select users.user_id, f_name || ' ' || l_name as evaluatee_name, team_name, evaluatee_id, evaluator_id, rating, comment, criteria
  from team_members tm
  FULL join evaluations ev on tm.user_id = ev.evaluatee_id
  FULL join evaluation_details ed on ev.evaluation_id = ed.evaluation_id
  join teams on teams.team_id = tm.team_id
  join users on users.user_id = tm.user_id
  where tm.team_id = $1
), -- getting teams and reviews
tr_with_evaluator AS (
  select f_name || ' ' || l_name as evaluator_name, evaluatee_name, team_name, evaluatee_id, evaluator_id, rating, comment, criteria
  from team_reviews
  join users on users.user_id = evaluator_id
), -- adding their evaluator's name
tw_with_average AS (
  SELECT evaluatee_id, evaluator_name, evaluatee_name, AVG(rating) average_rating, JSON_AGG(JSON_BUILD_OBJECT('criteria', criteria, 'rating', rating, 'comment', comment)) ratings
  FROM tr_with_evaluator
  GROUP BY evaluatee_id, evaluator_id, evaluator_name, evaluatee_name
) -- adding average
SELECT evaluatee_name, JSON_AGG(JSON_BUILD_OBJECT('evaluations', evaluator_name, 'average_rating', average_rating, 'ratings', ratings)) evaluations, count(*)
FROM tw_with_average
GROUP BY evaluatee_id, evaluatee_name; -- grouping by evaluatee`,
    values: [teamId]
  }
}

export { createOrUpdateEvaluation, getEvaluation }