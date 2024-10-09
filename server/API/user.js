import express from 'express';
import { createUser } from '../database/API.js';
import { db } from '../database/db.js';
import argon2 from 'argon2';

const router = express.Router();

const jsonConfigs = {
    limit: 50 * 1000, // 50 kb max json limit
}
router.use(express.json(jsonConfigs));

// creating a user in the database
router.route("/create")
    .post(async (req, res) => {
        const userObject = {
            password: req.body.password.normalize("NFKC"),
            firstName: req.body.firstName.normalize("NFKC").toLocaleLowerCase(),
            lastName: req.body.lastName.normalize("NFKC").toLocaleLowerCase(),
            email: req.body.email.normalize("NFKC").toLocaleLowerCase(),
            schoolID: req.body.schoolID.normalize("NFKC").toLocaleUpperCase(),
            role: req.body.role.normalize("NFKC").toLocaleUpperCase()
        }
        userObject.password_hash = await argon2.hash(userObject.password);
        const goodResult = await createUser(db, userObject);
        if (goodResult) {
            res.json({ created: true });
        } else {
            res.status(400).json({ created: false });
        }
    });

export { router }