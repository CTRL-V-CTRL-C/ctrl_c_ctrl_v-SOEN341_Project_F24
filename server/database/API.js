function verifyUser(username, password) {
    if (!(username && password)) {
        return false
    }
    return true
}


async function createUser(db, username, password) {
    if (!verifyUser(username, password)) {
        console.log("user can't be created")
        return false
    }
    const table = "users"
    const query = {
        name: "register-user",
        text: `INSERT INTO ${table} (username, password) VALUES ($1, $2)`,
        values: [username, password]
    }
    db.query(query)
    return true
}

export { createUser }