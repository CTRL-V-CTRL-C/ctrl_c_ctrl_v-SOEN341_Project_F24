import pg from 'pg'
import log from '../logger.js'
import { queryAndReturnError } from './db.js';


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
    name: `create-evaluation ${evaluatorId} ${evaluateeId}`,
    text: "INSERT INTO evaluations (team_id, evaluator_id, evaluatee_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING evaluation_id;",
    values: [teamId, evaluatorId, evaluateeId]
  };

  const createOrUpdateEvaluationDetails = {
    name: `create-or-update-evalutation-details ${evaluatorId} ${evaluateeId}`,
    text: "INSERT INTO evaluation_details (evaluation_id, criteria, rating, comment) VALUES ($1, $2, $3, $4) ON CONFLICT (evaluation_id, criteria) DO UPDATE SET rating = excluded.rating, comment = excluded.comment;",
    values: []
  };

  try {

    let result = await db.query(createEvaluationQuery);
    let evaluationId;
    if (!result.rows[0] || !result.rows[0].evaluation_id) {
      getEvaluationQuery.name = `get-evaluation ${evaluatorId} ${evaluateeId}`;
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
    name: `get-evaluation-details ${evaluatorId} ${evaluateeId}`,
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
 * queries the evaluation details for a team
 * @param {pg.Pool} db the db connection pool
 * @param {number} teamId the id of the team
 * @param {number} schoolId the id of the user
 * @returns {Promise<Array<JSON> | Error>} the evaluations or an erro
 */
async function getEvaluationDetails(db, teamId, schoolId) {
  const query = {
    name: `get-evaluation-details ${teamId}`,
    text: `
WITH team_reviews AS (
  select users.user_id, f_name || ' ' || l_name as evaluatee_name, school_id evaluatee_school_id, team_name, evaluatee_id, evaluator_id, rating, comment, criteria
  from team_members tm
  join teams on teams.team_id = tm.team_id
  join users on users.user_id = tm.user_id
  FULL join evaluations ev on tm.user_id = ev.evaluatee_id AND ev.team_id = teams.team_id
  FULL join evaluation_details ed on ev.evaluation_id = ed.evaluation_id
  WHERE tm.team_id = $1 AND users.school_id = $2
), -- getting teams and reviews
tr_with_evaluator AS (
  select f_name || ' ' || l_name as evaluator_name, school_id as evaluator_school_id, evaluatee_name, evaluatee_school_id, team_name, evaluatee_id, evaluator_id, rating, comment, criteria
  from team_reviews
  join users on users.user_id = evaluator_id
), -- adding their evaluator's name
tw_with_average AS (
  SELECT evaluatee_id, evaluator_name, evaluatee_name, evaluator_school_id, evaluatee_school_id, AVG(rating) average_rating, 
  JSON_AGG(
    JSON_BUILD_OBJECT('criteria', criteria, 'rating', rating, 'comment', comment)
    ORDER BY criteria
  ) ratings
  FROM tr_with_evaluator
  GROUP BY evaluatee_id, evaluator_id, evaluator_school_id, evaluatee_school_id, evaluator_name, evaluatee_name
) -- adding average
SELECT evaluatee_name, evaluatee_school_id, JSON_AGG(
  JSON_BUILD_OBJECT('evaluator_name', evaluator_name, 'average_rating', average_rating, 'ratings', ratings, 'evaluator_school_id', evaluator_school_id)
) evaluations, count(*)::int
FROM tw_with_average
GROUP BY evaluatee_id, evaluatee_school_id, evaluatee_name; -- grouping by evaluatee`,
    values: [teamId, schoolId]
  }

  const result = await queryAndReturnError(db, query, "There was an error querying the evealuation details for a team");
  if (result instanceof Error) {
    return result;
  }
  return result.rows[0];
}

/**
 * Gets the summary of evaluations for all team members in a team
 * @param {pg.Pool} db the database
 * @param {int} teamId the Id of the team
 * @returns {Promise<Error | Array<JSON>>}
 */
async function getTeamEvaluationSummary(db, teamId) {
  const getTeamEvaluationSummaryQuery = {
    name: `get-team-evaluation-summary ${teamId}`,
    text: `WITH avg_ratings AS (
        SELECT u.school_id, u.f_name, u.l_name, t.team_name, ed.criteria, AVG(ed.rating), COUNT(ed.criteria)::int
        FROM users u 
        JOIN team_members tm ON tm.user_id = u.user_id 
        JOIN teams t ON t.team_id = tm.team_id 
        FULL JOIN evaluations e ON e.evaluatee_id = u.user_id AND e.team_id = t.team_id --Not every student has an evaluation
        FULL JOIN evaluation_details ed ON ed.evaluation_id = e.evaluation_id --Need to keep the students with no evaluations
        WHERE t.team_id = $1 
        GROUP BY u.school_id,u.f_name,u.l_name,t.team_name, ed.criteria
        ORDER BY u.school_id, ed.criteria
      ) 
      SELECT ar.school_id, ar.f_name, ar.l_name, ar.team_name, JSON_AGG(
        JSON_BUILD_OBJECT('criteria', ar.criteria, 'average_rating', ar.avg)
        ORDER BY criteria
      ) ratings, avg(ar.avg) average, ar.count 
      FROM avg_ratings ar 
      GROUP BY ar.school_id, ar.f_name, ar.l_name, ar.team_name, ar.count 
      ORDER BY ar.school_id;`,
    values: [teamId]
  };

  try {

    let result = await db.query(getTeamEvaluationSummaryQuery);

    return result.rows;

  } catch (error) {
    log.error(`There was an error while getting the evaluation summary for team ${teamId}`);
    log.error(error);
    return error;
  }
}

/**
 * Gets the summary of evaluations for all students in a course
 * @param {pg.Pool} db the database
 * @param {int} courseId the Id of the course
 * @returns {Promise<Error | Array<JSON>>}
 */
async function getCourseEvaluationSummary(db, courseId) {
  const getCourseEvaluationSummaryQuery = {
    name: `get-course-evaluation-summary ${courseId}`,
    text: `WITH avg_ratings AS (
        SELECT u.school_id, u.f_name, u.l_name, t.team_name, ed.criteria, AVG(ed.rating), COUNT(ed.criteria) 
        FROM users u 
        JOIN team_members tm ON tm.user_id = u.user_id 
        JOIN teams t ON t.team_id = tm.team_id 
        FULL JOIN evaluations e ON e.evaluatee_id = u.user_id --Not every student has an evaluation
        FULL JOIN evaluation_details ed ON ed.evaluation_id = e.evaluation_id --Need to keep the students with no evaluations
        WHERE t.course_id = $1 
        GROUP BY u.school_id,u.f_name,u.l_name,t.team_name, ed.criteria
        ORDER BY u.school_id, ed.criteria
      ) 
      SELECT ar.school_id, ar.f_name, ar.l_name, ar.team_name, JSON_AGG(JSON_BUILD_OBJECT('criteria', ar.criteria, 'average_rating', ar.avg)) ratings, avg(ar.avg) average, ar.count 
      FROM avg_ratings ar 
      GROUP BY ar.school_id, ar.f_name, ar.l_name, ar.team_name, ar.count 
      ORDER BY ar.team_name, ar.school_id;`,
    values: [courseId]
  };

  try {

    let result = await db.query(getCourseEvaluationSummaryQuery);

    return result.rows;

  } catch (error) {
    log.error(`There was an error while getting the evaluation summary for course ${courseId}`);
    log.error(error);
    return error;
  }
}

/**
 * Gets the anonymized feedback from all the other teammates in a team about the given student
 * @param {pg.Pool} db the database
 * @param {int} userId the user id of the student
 * @param {int} teamId the team id of the team that the student belongs to
 * @returns {Promise<Error | Array<JSON>>}
 */
async function getAnonymizedFeedback(db, userId, teamId) {
  const getAnonymizedFeedbackQuery = {
    name: `get-anonymized-feedback ${userId} ${teamId}`,
    text: `
      WITH feedback AS (SELECT ed.criteria, AVG(ed.rating), COUNT(ed.criteria), JSON_AGG(ed.comment) comments
        FROM team_members tm
        JOIN evaluations e ON e.evaluator_id = tm.user_id
        JOIN evaluation_details ed ON ed.evaluation_id = e.evaluation_id
        WHERE tm.team_id = $1  AND e.evaluatee_id = $2
        GROUP BY ed.criteria
        ORDER BY ed.criteria)
      SELECT JSON_AGG(JSON_BUILD_OBJECT('criteria', criteria, 'avg', avg, 'count', count, 'comments', comments)) evaluations, AVG(avg) avg_across_all FROM feedback;`,
    values: [teamId, userId]
  };

  return await queryAndReturnError(db, getAnonymizedFeedbackQuery, `There was an error getting the feeback for user ${userId} in team ${teamId}`);

}

/**
 * Get whether a given team can see their feedback
 * @param {pg.Pool} db the database
 * @param {int} teamId The id of the team in question
 * @returns {Promise<Error | Array<JSON>>}
 */
async function canTeamGetFeedback(db, teamId) {
  const query = {
    name: `can-team-get-feedback ${teamId}`,
    text:
      `SELECT are_evaluations_released AS result FROM courses c
      JOIN teams t ON t.course_id = c.course_id
        WHERE team_id = $1;`,
    values: [teamId]
  }
  try {
    const result = await db.query(query);
    return result.rows[0].result;
  } catch (error) {
    log.error(`There was an error trying to check if team ${teamId} can see their feedback`);
    log.error(error);
    return error;
  }
}

/**
 * deletes an evaluation from the database
 * @param {pg.Pool} db the database connection
 * @param {int} teamId the id of the team
 * @param {int} evaluatorId the id of the evaluator
 * @param {int} evaluateeId the id of the evaluatee
 */
async function deleteEvaluation(db, teamId, evaluatorId, evaluateeId) {
  const query = {
    name: `delete-evaluation-${teamId}-${evaluatorId}-${evaluateeId}`,
    text: "DELETE FROM evaluations WHERE team_id = $1 AND evaluator_id = $2 AND evaluatee_id = $3",
    values: [teamId, evaluatorId, evaluateeId]
  }
  return await queryAndReturnError(db, query);
}

export { createOrUpdateEvaluation, getEvaluation, getTeamEvaluationSummary, getCourseEvaluationSummary, getEvaluationDetails, deleteEvaluation, getAnonymizedFeedback, canTeamGetFeedback }

