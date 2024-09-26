import pg from 'pg'
import log from '../logger.js'
/**
 * 
 * @param {object} userObject the object containing all the information about a user
 * @param {string} userObject.username
 * @param {string} userObject.password_hash
 * @param {string} userObject.salt
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
    // TODO: verification for the username and passwords (verify lengt, hash, etc.)
    return true
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
        hash = Buffer.from(userObject.password_hash, "hex")
    } catch (error) {
        return false;
    }
    const query = {
        name: "register-user",
        text: `INSERT INTO ${table} (username, hash, salt, f_name, l_name, email, school_id, role) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        values: [
            userObject.username, hash,
            userObject.salt, userObject.firstName,
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