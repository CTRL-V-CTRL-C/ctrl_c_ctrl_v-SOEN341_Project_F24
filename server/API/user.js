import express from 'express';
import { createUser } from '../database/API.js';
import { db } from '../database/db.js';
import argon2 from 'argon2';

const router = express.Router();

// creating a user in the database
router.post("/create", async (req, res, next) => {
    const userObject = {
        password: req.body.password.normalize("NFKC"),
        firstName: req.body.firstName.normalize("NFKC").toLocaleLowerCase(),
        lastName: req.body.lastName.normalize("NFKC").toLocaleLowerCase(),
        email: req.body.email.normalize("NFKC").toLocaleLowerCase(),
        schoolID: req.body.schoolID.normalize("NFKC").toLocaleUpperCase(),
        role: req.body.role.normalize("NFKC").toLocaleUpperCase()
    }
    const argon2Options = {
        memoryCost: 19 * 2 ** 10, // 19MiB
        hashLength: 32,
        timeCost: 2,
        parallelism: 1,
        type: argon2.argon2id,
        saltLength: 16,
    }
    userObject.password_hash = await argon2.hash(userObject.password, argon2Options);
    const error = await createUser(db, userObject);
    if (error) {
        res.status(400).json({ error });
    } else {
        res.json({ created: true });
    }
    next();
});

export { router }