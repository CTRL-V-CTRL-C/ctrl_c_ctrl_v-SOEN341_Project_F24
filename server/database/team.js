// eslint-disable-next-line no-unused-vars
import pg from 'pg'
import log from '../logger.js'
import { queryAndReturnError } from './db.js';
import { createUser, verifyUser } from './user.js';
import { generatePasswordHash } from '../internal/password.js';
import { sendTempPasswordEmail } from '../internal/email.js';

/**
 * 
 * @param {import('./user.js').User[]} members the array containing the user ids of the members
 */
function verifyMembers(members) {
    for (const member of members) {
        const error = verifyUser(member);
        if (error) {
            return error;
        }
    }
    return null;
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
        name: `check-same-team ${teamId} ${userId1} ${userId2}`,
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
 * @param {string[]} schoolIDs the studentIDs of the users
 */
async function getUserIds(db, schoolIDs) {

    let values = "";
    for (let index = 1; index <= schoolIDs.length; index++) {
        values += `$${index},`
    }
    values = values.substring(0, values.length - 1);
    const query = {
        text: `SELECT user_id, school_id FROM users WHERE school_id IN (${values})`,
        values: schoolIDs,
    };
    const result = await db.query(query);
    return result.rows.reduce((accumulator, current) => {
        accumulator[current.school_id] = current.user_id;
        return accumulator
    }, {});
}

/**
 * @param {pg.Pool} db the database to query
 * @param {int} courseID the id of the course for which the team must be created
 * @param {string} teamName the name of the team
 * @param {import('./user.js').User[]} members the info of the members of the team
 * @returns {Promise<Error | string>} an error if the team could not be created, a string containing the id of the team created otherwise
 */
async function createTeam(db, courseID, teamName, members) {
    const query = {
        name: `create-team ${courseID} ${teamName} `,
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
    if (!Array.isArray(members) || members.length == 0) {
        return teamId;
    }
    const error = await addTeamMembers(db, teamId, members);
    if (error) {
        return error;
    }
    return teamId;
}

/**
 * @param {pg.Pool} db
 * @param {string} teamId the id of the team
 * @param {import('./user.js').User[]} members the info of the member of the team
 * @returns {Promise<Error | null>} an error if the members could not be added to the team, null otherwise
 */
async function addTeamMembers(db, teamId, members) {
    const error = verifyMembers(members);
    if (error) {
        log.debug("Team members were not added");
        log.debug(error);
        return error;
    }

    const schoolIDs = members.map(member => member.schoolID);
    let userIdMap = await getUserIds(db, schoolIDs);

    // some members don't have an account
    if (Object.keys(userIdMap).length != members.length) {
        const uncreatedMembers = members.filter(member => userIdMap[member.schoolID] === undefined)
        for (const member of uncreatedMembers) {
            const errorOrPassword = await createStudentAccount(db, member);
            if (errorOrPassword instanceof Error) {
                log.error("There was an error while creating the user");
                return error;
            } else {
                // send the email on async so it doesn't block this function
                sendTempPasswordEmail(member.email, errorOrPassword);
            }
        }
        const schoolIDs = members.map(member => member.schoolID);
        const otherIdsMap = await getUserIds(db, schoolIDs);
        userIdMap = Object.assign({}, userIdMap, otherIdsMap);
    }

    const values = Object.values(userIdMap).flatMap((member) => [teamId, member]);
    if (values.length == 0) {
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
        name: `add-team-members ${teamId}`,
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
 * creates a new user in the database with a new password for when a team member doesn't exist
 * @param {pg.Pool} db the database connection
 * @param {import('./user.js').User} user the user to create
 * @returns an error if any occured or the password that was created
 */
async function createStudentAccount(db, user) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = "";
    for (let i = 0; i < 10; i++) {
        const randomCharacter = characters.charAt(Math.random() * characters.length);
        password += randomCharacter;
    }
    const passwordHash = await generatePasswordHash(password);
    user.password_hash = passwordHash;

    const error = await createUser(db, user);
    if (error) {
        return error;
    }
    return password;
}

/**
 * deletes a team from the db
 * @param {pg.Pool} db the db
 * @param {string} teamID the id of the team to delete
 */
async function deleteTeam(db, teamID) {
    const query = {
        name: `delete-team-members ${teamID}`,
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
        name: `teacher-made-team ${teamID} ${teacherID}`,
        text:
            `SELECT COUNT(*) = 1 AS result FROM teams t 
            JOIN courses c
            ON t.course_id = c.course_id
                WHERE t.team_id = $1
                AND c.instructor_id = $2`,
        values: [teamID, teacherID]
    }
    try {
        const result = await db.query(query);
        return result.rows[0].result;
    } catch (error) {
        log.error(`There was an error trying to check if ${teacherID} teaches team ${teamID}`);
        log.error(error);
        return error;
    }
}

/**
 * 
 * @param {pg.Pool} db the database
 * @param {number} schoolId the school id of the student
 * @param {number} teamId the id of the team
 */
async function userIsInTeam(db, schoolId, teamId) {
    const query = {
        name: `user-is-in-team ${schoolId} ${teamId}`,
        text: `
        SELECT count(*) = 1 AS result
        FROM team_members
        JOIN users
        ON users.user_id = team_members.user_id
            WHERE school_id = $1 AND team_id = $2;
        `,
        values: [schoolId, teamId]
    }
    const result = await queryAndReturnError(db, query, "There was an error while checking if a user is in a team")
    if (result instanceof Error) {
        return false;
    }
    return result.rows[0].result;
}

export { createTeam, deleteTeam, teacherMadeTeam, areInSameTeam, userIsInTeam };