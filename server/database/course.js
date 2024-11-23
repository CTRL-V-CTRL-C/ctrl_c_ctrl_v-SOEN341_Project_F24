import pg from 'pg'
import log from '../logger.js'
import { sendReleaseNotificationEmail } from '../internal/email.js';

/**
 * creates a course entry in the database
 * @param {pg.Pool} db the database
 * @param {string} instructorID the id of the instructor
 * @param {string} courseName the name of the course
 * @returns {Promise<Error | string>} the course id or an error if any
 */
async function createCourse(db, instructorID, courseName) {
    const query = {
        name: `create-course ${instructorID}`,
        text: "INSERT INTO courses (course_name, instructor_id) VALUES ($1, $2) RETURNING course_id;",
        values: [courseName, instructorID]
    }
    try {
        const result = await db.query(query);
        const courseID = result.rows[0].course_id;
        return courseID;
    } catch (error) {
        log.error("There was an error while creating the courses");
        log.error(error);
        return error;
    }
}

/**
 * Get whether a given course has released its evaluations
 * @param {*} db the database
 * @param {*} course_id The id of the course in question
 */
async function areEvaluationsReleased(db, courseId) {
    const query = {
        name: `are-evaluations-released ${courseId} ${Math.random()}`,
        text:
            `SELECT are_evaluations_released AS result FROM courses 
                WHERE course_id = $1;`,
        values: [courseId]
    }
    try {
        const result = await db.query(query);
        return result.rows[0].result;
    } catch (error) {
        log.error(`There was an error trying to check if course ${courseId} has released its evaluations`);
        log.error(error);
        return error;
    }
}

/**
 * Release the evaluations for a given course
 * @param {*} db the database
 * @param {*} course_id The id of the course in question
 */
async function releaseEvaluations(db, courseId) {
    const releaseQuery = {
        name: `releaseEvaluations ${courseId} ${Math.random()}`,
        text:
            `UPDATE courses 
                SET are_evaluations_released = TRUE
                WHERE course_id = $1;`,
        values: [courseId]
    }
    const getAllEmailsQuery = {
        name: `getAllEmails ${courseId} ${Math.random()}`,
        text:
            `SELECT email, course_name FROM courses c
                JOIN teams t ON t.course_id = c.course_id
                JOIN team_members tm ON tm.team_id = t.team_id
                JOIN users u ON u.user_id = tm.user_id
                WHERE c.course_id = $1;`,
        values: [courseId]
    }
    try {
        const result = await db.query(releaseQuery);
        const emailsResult = await db.query(getAllEmailsQuery);

        for (let { email, course_name } of emailsResult.rows) {
            sendReleaseNotificationEmail(email, course_name);
        }
        return result;
    } catch (error) {
        log.error(`There was an error trying to release the evaluations of course ${courseId}`);
        log.error(error);
        return error;
    }
}

export { createCourse, releaseEvaluations, areEvaluationsReleased }