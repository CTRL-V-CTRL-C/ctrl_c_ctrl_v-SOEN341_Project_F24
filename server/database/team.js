import pg from 'pg'
import log from '../logger.js'
import { queryAndReturnError } from './db.js';


/**
 * @param {string[]} members the array containing the user ids of the members
 */
function verifyMembers(members) {
    if (members.length == 0) {
        log.debug("The team was not created since there are no members");
        return false;
    }
    const allStrings = members.every((member) => typeof member === 'string');
    if (!allStrings) {
        log.debug("Not all the ids of the team members are strings");
    }
    return allStrings;
}

/**
 * Check whether two users are in the same team
 * @param {pg.Pool} db 
 * @param {int} teamId The ID of the team
 * @param {int} userId1 The ID of the first user
 * @param {int} userId2 The ID of the second user
 * @returns {Promise<Error | boolean>} whether or not the two users are in the same team
 */
async function areInSameTeam(db, teamId, userId1, userId2) {
    const query = {
        name: "check-same-team",
        text: "SELECT * FROM team_members WHERE team_id = $1 AND (user_id = $2 OR user_id = $3);",
        values: [teamId, userId1, userId2]
    };

    try {
        const result = await db.query(query);
        return result.rows.length == 2;
    } catch (error) {
        log.error(`There was an error trying to check if ${userId1} and ${userId2} are in the same team`);
        log.error(error);
        return error;
    }
}

/**
 * @param {pg.Pool} db
 * @param {string[]} emails the emails of the users
 */
async function getUserIds(db, emails) {

    let values = "";
    for (let index = 1; index <= emails.length; index++) {
        values += `$${index},`
    }
    values = values.substring(0, values.length - 1);
    const query = {
        text: `SELECT (user_id) FROM users WHERE email IN (${values})`,
        values: emails,
    };
    const result = await db.query(query);
    return result.rows.map((row) => row.user_id);
}

/**
 * @param {pg.Pool} db the database to query
 * @param {int} courseID the id of the course for which the team must be created
 * @param {string} teamName the name of the team
 * @param {string[]} emails the emails of the members of the team
 * @returns {Promise<Error | string>} an error if the team could not be created, a string containing the id of the team created otherwise
 */
async function createTeam(db, courseID, teamName, emails) {
    const query = {
        name: 'create-team',
        text: "INSERT INTO teams (team_name, course_id) VALUES ($1, $2) RETURNING team_id;",
        values: [teamName, courseID]
    }
    let teamId = undefined;
    try {
        const result = await db.query(query);
        const row = result.rows[0];
        teamId = row.team_id;
    } catch (error) {
        log.error("There was an error while creating a team");
        log.error(error);
        return error;
    }
    if (!(Array.isArray(emails) && emails.length != 0)) {
        return teamId;
    }
    const error = await addTeamMembers(db, teamId, emails);
    if (error) {
        return error;
    }
    return teamId;
}

/**
 * @param {pg.Pool} db
 * @param {string} teamId the id of the team
 * @param {string[]} members the emails of the member of
 * @returns {Promise<Error | null>} an error if the members could not be added to the team, null otherwise
 */
async function addTeamMembers(db, teamId, members) {
    if (!verifyMembers(members)) {
        log.info("Team members were not added");
        return new Error("the team members could not be verified");
    }

    let userIds = undefined;
    try {
        userIds = await getUserIds(db, members);
    } catch (error) {
        log.error("There was an error while getting the user id's");
        log.error(error);
        return error;
    }

    const values = userIds.flatMap((member) => [teamId, member]);
    if (values.length ==0){
        log.info('None of the team members exist')
        return null; //there are no users that exist
    }
    let preparedValues = "";
    for (let index = 1; index <= values.length; index += 2) {
        preparedValues += `($${index}, $${index + 1}),`
    }
    preparedValues = preparedValues.substring(0, preparedValues.length - 1);
    const sqlQuery = `INSERT INTO team_members (team_id, user_id) VALUES ${preparedValues};`
    const query = {
        name: "add-team-members",
        text: sqlQuery,
        values: values
    }
    try {
        await db.query(query);
    } catch (error) {
        log.error("There was an error while adding team members");
        log.error(error);
        return error;
    }
    return null;
}

/**
 * deletes a team from the db
 * @param {pg.Pool} db the db
 * @param {string} teamID the id of the team to delete
 */
async function deleteTeam(db, teamID) {
    const query = {
        name: "delete-team-members",
        text: "DELETE FROM teams WHERE team_id = $1",
        values: [teamID]
    }

    const result = await queryAndReturnError(db, query, "There was an error while deleting the teams");

    if (result instanceof Error) {
        return result;
    }
    return null;
}

/**
 * checks if a teacher made a particular team
 * @param {pg.Pool} db 
 * @param {number} teamID the id of the team
 * @param {number} teacherID the id of the teacher
 * @return {Promise<boolean>} if the teacher made the team, false otherwise
 */
async function teacherMadeTeam(db, teamID, teacherID) {
    const query = {
        name: "teacher-made-team",
        text:
            `SELECT COUNT(*) = 1 AS result FROM teams t 
            JOIN courses c
            ON t.course_id = c.course_id
                WHERE t.team_id = $1
                AND c.instructor_id = $2`,
        values: [teamID, teacherID]
    }
    const result = await db.query(query);
    return result.rows[0].result;
}

export { createTeam, deleteTeam, teacherMadeTeam, areInSameTeam };