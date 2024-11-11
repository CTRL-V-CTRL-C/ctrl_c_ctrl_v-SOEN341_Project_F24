import express from 'express';
import { createUser } from '../database/user.js';
import { db } from '../database/db.js';
import { generatePasswordHash } from '../internal/password.js';

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
    userObject.password_hash = await generatePasswordHash(userObject.password);
    const error = await createUser(db, userObject);
    if (error) {
        res.status(400).json({ msg: error.message });
    } else {
        res.json({ created: true });
    }
    next();
});

export { router }