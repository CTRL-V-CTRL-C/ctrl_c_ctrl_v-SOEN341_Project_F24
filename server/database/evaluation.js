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
 * @param {int} teamId the id of the team
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
 * Gets the evaluation details of a given student in a team
 * @param {pg.Pool} db the database
 * @param {int} evaluatorId the id of the student evaluating
 * @param {int} evaluateeId the id of the student being evaluated
 * @param {int} teamId the id of the team
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

/**
 * Gets the summary of evaluations for all team members in a team
 * @param {pg.Pool} db the database
 * @param {int} teamId the name of the course
 * @returns {Promise<Error | Array<JSON>>}
 */
async function getEvaluationSummary(db, teamId) {
  const getEvaluationSummaryQuery = {
    name: "get-evaluation-summary",
    text: "WITH avg_ratings AS (SELECT u.school_id, u.f_name, u.l_name, t.team_name, ed.criteria, AVG(ed.rating), COUNT(ed.criteria) FROM users u JOIN team_members tm ON tm.user_id = u.user_id JOIN teams t ON t.team_id = tm.team_id FULL JOIN evaluations e ON e.evaluatee_id = u.user_id FULL JOIN evaluation_details ed ON ed.evaluation_id = e.evaluation_id WHERE t.team_id = $1 GROUP BY u.school_id,u.f_name,u.l_name,t.team_name, ed.criteria ORDER BY u.school_id) SELECT ar.school_id, ar.f_name, ar.l_name, ar.team_name, JSON_AGG(JSON_BUILD_OBJECT('criteria', ar.criteria, 'average_rating', ar.avg)) ratings, ar.count FROM avg_ratings ar GROUP BY ar.school_id, ar.f_name, ar.l_name, ar.team_name, ar.count ORDER BY ar.school_id;",
    values: [teamId]
  };

  try {

    let result = await db.query(getEvaluationSummaryQuery);

    return result.rows;

  } catch (error) {
    log.error(`There was an error while getting the evaluation summary for team ${teamId}`);
    log.error(error);
    return error;
  }
}

export { createOrUpdateEvaluation, getEvaluation, getEvaluationSummary }