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
        const username = req.body.username;
        const password = req.body.password;
        const goodResult = await createUser(db, username, password);
        if (goodResult) {
            res.json({ created: true });
        } else {
            res.status(400).json({ created: false });
        }
    });

export { router }