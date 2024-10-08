import express from 'express';
import { createUser } from '../database/API.js';
import { db } from '../database/db.js';
import argon2 from 'argon2';

const router = express.Router();

// creating a user in the database
router.route("/create")
    .post(async (req, res, next) => {
        const userObject = {
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            schoolID: req.body.schoolID,
            role: req.body.role
        }
        userObject.password_hash = await argon2.hash(userObject.password);
        const error = await createUser(db, userObject);
        if (error) {
            res.status(400).json({ error });
        } else {
            res.json({ created: true });
        }
        next();
    });

export { router }