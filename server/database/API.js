import pg from 'pg'
import log from '../logger.js'

//Account creation validation
const namePattern = /^[a-zA-Z'\-]+$/v;
const emailPattern = /^[a-zA-Z0-9.]+@[A-Za-z0-9]+\.[A-Za-z0-9]+$/v;
const studentIDPattern = /^[Ss][Tt][Uu][Dd][0-9]{4,4}$/v;
const InstructorIDPattern = /^[Ii][Nn][Ss][Tt][0-9]{4,4}$/v;

/**
 * 
 * @param {object} userObject the object containing all the information about a user
 * @param {string} userObject.username
 * @param {string} userObject.password_hash
 * @param {string} userObject.firstName
 * @param {string} userObject.lastName
 * @param {string} userObject.email
 * @param {string} userObject.schoolID
 * @param {string} userObject.role
 * @returns {bool} true if the username and password are valid, false otherwise
 */
function verifyUser(userObject) {
    for (const key of Object.values(userObject)) {
        if (!key) {
            return false;
        }
    }
    let valid = !!userObject.firstName.match(namePattern) &&
        !!userObject.lastName.match(namePattern) &&
        !!userObject.email.match(emailPattern) &&
        !!userObject.role.match(/(STUD|INST)/) &&
        !!userObject.schoolID.match(!!userObject.role.match(/INST/) ? InstructorIDPattern : studentIDPattern);
    // TODO: verification for the username and passwords (verify lengt, hash, etc.)
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
        text: `INSERT INTO ${table} (username, hash, f_name, l_name, email, school_id, role) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        values: [
            userObject.username, hash,
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