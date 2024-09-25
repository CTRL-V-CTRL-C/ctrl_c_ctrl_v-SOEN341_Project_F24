import express from 'express'
import { createUser } from '../database/API.js'
import { db } from '../database/db.js'

const router = express.Router();

const jsonConfigs = {
    limit: 50 * 1000, // 50 kb max json limit
}
router.use(express.json(jsonConfigs));

// creating a user in the database
router.route("/create")
    .post(async (req, res) => {
        const userObject = {
            username: req.body.username,
            password_hash: req.body.password_hash,
            salt: req.body.salt,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            schoolID: req.body.schoolID,
            role: req.body.role
        }
        const goodResult = await createUser(db, userObject);
        if (goodResult) {
            res.json({ created: true });
        } else {
            res.status(400).json({ created: false });
        }
    });

export { router }