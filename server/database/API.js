import pg from 'pg'
import log from '../logger.js'

//Account creation validation
const namePattern = /^[a-zA-Z'\-]+$/v;
const emailPattern = /^[a-zA-Z0-9.]+@[A-Za-z0-9]+\.[A-Za-z0-9]+$/v;
const studentIDPattern = /^[Ss][Tt][Uu][Dd][0-9]{4,4}$/v;
const instructorIDPattern = /^[Ii][Nn][Ss][Tt][0-9]{4,4}$/v;
const rolePattern = /^(STUD|INST)$/v;
const isInstructorPattern = /^INST$/v;

/**
 * 
 * @param {object} userObject the object containing all the information about a user
 * @param {string} userObject.password_hash
 * @param {string} userObject.firstName
 * @param {string} userObject.lastName
 * @param {string} userObject.email
 * @param {string} userObject.schoolID
 * @param {string} userObject.role
 * @returns {Error | null} an error if the user creation has failed. null otherwise
 */
function verifyUser(userObject) {
    for (const [key, value] of Object.entries(userObject)) {
        if (!value) {
            return new Error(`The key: ${key} is necessary for this request`);
        }
    }

    const firstNameValid = namePattern.test(userObject.firstName);
    const lastNameValid = namePattern.test(userObject.lastName);
    const emailValid = emailPattern.test(userObject.email);
    const roleValid = rolePattern.test(userObject.role);
    const IDisValid = isInstructorPattern.test(userObject.role) ? instructorIDPattern.test(userObject.schoolID) : studentIDPattern.test(userObject.schoolID);
    if (!(firstNameValid && lastNameValid && emailValid && roleValid && IDisValid)) {
        const requiredFields = { firstNameValid, lastNameValid, emailValid, roleValid, IDisValid };
        return new Error(`One or many of these fields were not valid: ${JSON.stringify(requiredFields)}`);
    }

    return null;
}

/**
 * 
 * @param {pg.Client} db the database to query
 * @param userObject the object containing all the information about a user
 * @returns {Promise<Error|null>} an Error if any, null otherwise
*/
async function createUser(db, userObject) {
    const verifyUserError = verifyUser(userObject);
    if (verifyUserError) {
        log.warn("user can't be created")
        log.warn(verifyUserError)
        return verifyUserError;
    }
    const table = "users"
    let hash = undefined;
    try {
        hash = Buffer.from(userObject.password_hash)
    } catch (error) {
        return error;
    }
    const query = {
        name: "register-user",
        text: `INSERT INTO ${table} (hash, f_name, l_name, email, school_id, role) 
        VALUES ($1, $2, $3, $4, $5, $6)`,
        values: [
            hash,
            userObject.firstName,
            userObject.lastName, userObject.email,
            userObject.schoolID, userObject.role
        ]
    }

    try {
        await db.query(query);
    } catch (error) {
        log.error("There was an error while querying the database");
        log.error(error);
        return error;
    }
    return null;
}

/**
 * @param {string[]} members the array containing the user ids of the members
 */
function verifyMembers(members) {
    if (!Array.isArray(members)) {
        log.debug("The team mebers could not be create because it is not an array");
        return false;
    }
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
 * @param {pg.Client} db
 * @param {string[]} emails the emails of the users
 */
async function getUserIds(db, emails) {

    let values = "";
    for (let index = 1; index <= emails.length; index++) {
        values += `$${index},`
    }
    values = values.substring(0, values.length - 1);
    const query = {
        name: 'get-users',
        text: `SELECT (user_id) FROM users WHERE email IN (${values})`,
        values: emails,
    };
    const result = await db.query(query);
    return result.rows.map((row) => row.user_id);
}

/**
 * @param {pg.Client} db the database to query
 * @param {string} teamName the name of the team
 * @param {string[]} emails the emails of the members of the team
 */
async function createTeam(db, teamName, emails) {
    const query = {
        name: 'create-team',
        text: "INSERT INTO teams (team_name) VALUES ($1) RETURNING team_id;",
        values: [teamName]
    }
    let teamId = undefined;
    try {
        const result = await db.query(query);
        const row = result.rows[0];
        log.info(row);
        teamId = row.team_id;
    } catch (error) {
        log.error("There was an error while querying the database");
        log.error(error);
        return error;
    }
    addTeamMembers(teamId, emails);
}

/**
 * @param {pg.Client} db
 * @param {string} teamId the id of the team
 * @param {string[]} members the emails of the member of
 */
async function addTeamMembers(teamId, members) {
    if (!verifyMembers(members)) {
        log.info("Team members were not added");
        return;
    }

    let userIds = undefined;
    try {
        userIds = await getUserIds(members);
    } catch (error) {
        log.error("There was an error while getting the user id's");
        log.error(error);
        return;
    }

    const values = userIds.flatMap((member) => [teamId, member]);

    let preparedValues = "";
    for (let index = 1; index <= values.length; index += 2) {
        preparedValues += `($${index}, $${index + 1}),`
    }
    preparedValues = preparedValues.substring(0, preparedValues.length - 1);
    const sqlQuery = `INSERT INTO team_members (team_id, user_id) VALUES ${preparedValues};`
    log.debug(sqlQuery);
    const query = {
        name: "add-team-members",
        text: sqlQuery,
        values: values
    }
    try {
        await db.query(query);
    } catch (error) {
        log.error("There was an error while querying the database");
        log.error(error);
    }
}

export { createUser, createTeam }