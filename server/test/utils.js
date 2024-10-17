import pg from 'pg'

function randomLetters(maxLength) {
    const r = (Math.random() + 1).toString(36).substring(2)
    if (maxLength) {
        return r.substring(r.length - maxLength)
    }
    return r
}

function randomNumber(length) {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
}

/**
 * connects the database if it is disconnected
 * @param {pg.Pool} db 
 */
async function connectDbIfDisconnected(db) {
    if (db.ended) {
        await db.connect();
    }
}

export { randomLetters, randomNumber, connectDbIfDisconnected }