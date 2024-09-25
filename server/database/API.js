import pg from 'pg'
/**
 * 
 * @param {string} username the username of the new user
 * @param {string} password_hash the password of the new user (must be a hexadecimal hash)
 * @returns {bool} true if the username and password are valid, false otherwise
 */
function verifyUser(username, password_hash) {
    if (username.length == 0 || password_hash.length == 0) {
        return false
    }
    // TODO: verification for the username and passwords (verify lengt, hash, etc.)
    return true
}

/**
 * 
 * @param {pg.Client} db the database to query
 * @param {string} username the username of the new user to create
 * @param {string} password_hash the password of the new user (must be a hexadecimal hash)
 * @returns {bool} true if the user could be created, false otherwise
 */
async function createUser(db, username, password_hash) {
    if (!verifyUser(username, password_hash)) {
        console.log("user can't be created")
        return false
    }
    const table = "users"
    const query = {
        name: "register-user",
        text: `INSERT INTO ${table} (username, password) VALUES ($1, $2)`, // this query is wrong
        values: [username, password_hash]
    }
    console.log("here")
    await db.query(query)
    console.log("and now here");

    return true
}

export { createUser }