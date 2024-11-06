import pg from 'pg'
import log from '../logger.js'

/**
 * creates a course entry in the database
 * @param {pg.Pool} db the database
 * @param {string} instructorID the id of the instructor
 * @param {string} courseName the name of the course
 * @returns {Promise<Error | string>}
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

export { createCourse }