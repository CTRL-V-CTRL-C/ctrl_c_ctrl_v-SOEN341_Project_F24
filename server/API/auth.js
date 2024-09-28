import express from 'express';
import session from 'express-session';
import sessionStore from 'connect-pg-simple';
import { db, pool } from '../database/db.js';
import dotenv from 'dotenv';
import log from '../logger.js';
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
    res.status(401).json({ error: "Unauthorised" }); // User is not authenticated
  }
}

//Require to be logged out to attempt certain endpoints
const requireNoAuth = (req, res, next) => {
  if (req.session.user) {
    log.warn({}, `Authenticated user tried to access ${req.originalUrl}`);
    res.status(401).json({ error: "Can't be logged in" }); // User is already authenticated
  } else {
    next(); // User not authenticated, continue to next middleware
  }
}

//Login with correct username and hash
router.post("/login", requireNoAuth, async (req, res) => {
  let username = req.body.username;
  let hash = req.body.hash;

  try {

    let query = await db.query("SELECT user_id, f_name, l_name, email, school_id, role FROM users WHERE username = $1 AND hash = $2", [username, hash]);

    if (query.rows.length != 1) {

      log.warn({}, `User ${username} Failed to log in`);
      res.status(404).json({ login: "failure" });

    } else {

      log.info({}, `User ${username} Successfully logged in`);
      req.session.user = query.rows[0];
      res.status(200).json({ login: "success" });

    }
  } catch (error) {
    log.error(error, `Something went wrong trying to log in for user ${username}`);
    res.status(500).json({ error: "Something went wrong on our end" });
  }
});

//Get the salt associated with the username to compute the correct hash
router.post("/login/get-salt", requireNoAuth, async (req, res) => {
  let username = req.body.username;
  try {

    let query = await db.query("SELECT salt FROM users WHERE username = $1", [username]);

    if (query.rows.length != 1) {

      log.warn({}, `User ${username} tried to log in but does not exist`);
      res.status(404).json({ login: "failure" });

    } else {

      res.json({
        username: username,
        salt: query.rows[0].salt,
      });

    }
  } catch (error) {
    log.error(error, `Something went wrong trying to fetch the salt for user ${username}`);
    res.status(500).json({ error: "Something went wrong on our end" });
  }
});

//Logout and destroy the authentication session
router.post("/logout", requireAuth, async (req, res) => {
  let user = req.session.user;
  req.session.destroy(error => {
    if (error) {
      log.error(error, `Failed to destroy session for ${user.email}`);
      res.status(500).json({ error: "Something went wrong on our end" });
    }
    log.info({}, `Successfully destroyed session for ${user.email}`);
    res.clearCookie("authentication");
    res.status(200).json({ loggedOut: true });
  });
});

router.post("/test-authentication", requireAuth, (req, res) => {
  res.status(200).json({ isAuthenticated: true });
});

export { router, requireAuth };