import express from 'express';
import session from 'express-session';
import sessionStore from 'connect-pg-simple';
import { db, pool } from '../database/db.js';
import dotenv from 'dotenv';
import log from '../logger.js';
import argon2 from 'argon2';
dotenv.config();

const router = express.Router();

const jsonConfigs = {
  limit: 50 * 1000, // 50 kb max json limit
};

router.use(express.json(jsonConfigs));

//Make everything use the session
router.use(session({
  store: new (sessionStore(session))({
    pool: pool,
    createTableIfMissing: true,
  }),
  name: "authentication",
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000,
    secure: false,
    httpOnly: true,
    sameSite: 'strict'
  }
}));

//Backend authentication to allow use of certain endpoints
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next(); // User is authenticated, continue to next middleware
  } else {
    log.warn({}, `Unauthorised user tried to access ${req.originalUrl}`);
    res.status(401).json({ msg: "Unauthorised to perform this action" }); // User is not authenticated
  }
}

//Require to be logged out to attempt certain endpoints
const requireNoAuth = (req, res, next) => {
  if (req.session.user) {
    log.warn({}, `Authenticated user tried to access ${req.originalUrl}`);
    res.status(401).json({ msg: "Can't be logged in to perform this action" }); // User is already authenticated
  } else {
    next(); // User not authenticated, continue to next middleware
  }
}

//Login with correct email and password
router.post("/login", requireNoAuth, async (req, res) => {
  const email = req.body.email.normalize("NFKC").toLocaleLowerCase();
  const password = req.body.password.normalize("NFKC");

  try {

    const hashQuery = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (hashQuery.rows.length != 1) {
      log.warn({}, `User ${email} tried to log in but does not exist`);
      res.status(404).json({ msg: "Incorrect email or password" });
    } else {
      const hash = hashQuery.rows[0].hash;
      delete hashQuery.rows[0].hash;

      const success = await argon2.verify(hash.toString(), password);

      if (success) {

        log.info({}, `User ${email} Successfully logged in`);
        req.session.user = hashQuery.rows[0];
        res.status(200).json({ msg: "Successfully logged in" });

      } else {

        log.warn({}, `User ${email} Failed to log in`);
        res.status(404).json({ msg: "Incorrect email or password" });

      }
    }
  } catch (error) {
    log.error(error, `Something went wrong trying to log in for user ${email}`);
    res.status(500).json({ msg: "Something went wrong on our end, try again in a bit" });
  }
});

//Logout and destroy the authentication session
router.post("/logout", requireAuth, async (req, res) => {
  let user = req.session.user;
  req.session.destroy(error => {
    if (error) {
      log.error(error, `Failed to destroy session for ${user.email}`);
      res.status(500).json({ msg: "Something went wrong on our end, try again in a bit" });
    }
    log.info({}, `Successfully destroyed session for ${user.email}`);
    res.clearCookie("authentication");
    res.status(200).json({ msg: "Successfully logged out" });
  });
});

//Test whether or not you are authenticated
router.post("/test-authentication", requireAuth, (req, res) => {
  res.status(200).json({ msg: "User is authenticated" });
});

export { router, requireAuth };