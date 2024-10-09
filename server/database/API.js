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
 * @returns {bool} true if the email and password are valid, false otherwise
 */
function verifyUser(userObject) {
    for (const key of Object.values(userObject)) {
        if (!key) {
            return false;
        }
    }
    let valid = namePattern.test(userObject.firstName) &&
        namePattern.test(userObject.lastName) &&
        emailPattern.test(userObject.email) &&
        rolePattern.test(userObject.role) &&
        isInstructorPattern.test(userObject.role) ? instructorIDPattern.test(userObject.schoolID) : studentIDPattern.test(userObject.schoolID);
    // TODO: verification for the email and passwords (verify lengt, hash, etc.)
    return valid;
}

/**
 * 
 * @param {pg.Client} db the database to query
 * @param userObject the object containing all the information about a user
 * @returns {bool} true if the user could be created, false otherwise
 */
async function createUser(db, userObject) {
    if (!verifyUser(userObject)) {
        log.warn("user can't be created")
        return false
    }
    const table = "users"
    let hash = undefined;
    try {
        hash = Buffer.from(userObject.password_hash)
    } catch (error) {
        return false;
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
        return false;
    }

    return true
}

export { createUser }