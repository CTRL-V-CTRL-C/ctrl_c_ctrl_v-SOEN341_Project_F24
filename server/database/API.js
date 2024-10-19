import pg from 'pg'
import log from '../logger.js'
import { queryAndReturnError } from './db.js';

//Account creation validation
const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\-]+$/v;
const emailPattern = /^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}$/v;
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
 * @param {pg.Pool} db the database to query
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
    const query = {
        name: "register-user",
        text: `INSERT INTO ${table} (hash, f_name, l_name, email, school_id, role) 
        VALUES ($1, $2, $3, $4, $5, $6)`,
        values: [
            userObject.password_hash,
            userObject.firstName,
            userObject.lastName, userObject.email,
            userObject.schoolID, userObject.role
        ]
    }

    const result = await queryAndReturnError(db, query, "There was an error while creating a user");

    if (result instanceof Error) {
        return result;
    }
    return null;
}

export { createUser };