import express from 'express';
import session from 'express-session';
import sessionStore from 'connect-pg-simple';
import { db } from '../database/db.js';
import dotenv from 'dotenv';
import log from '../logger.js';
import argon2 from 'argon2';
import { teacherMadeTeam } from '../database/team.js';
dotenv.config();

const router = express.Router();

//Make everything use the session
router.use(session({
  store: new (sessionStore(session))({
    pool: db,
    createTableIfMissing: true,
  }),
  name: "authentication",
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1 * 60 * 60 * 1000, // one hour
    secure: false,
    httpOnly: true,
    sameSite: 'strict'
  }
}));

/**
 * a middleware to make sure that the logged in user is a teacher
 * @param {express.Request} req the request
 * @param {express.Response} res the response
 * @param {express.NextFunction} next the function to call the next middleware
 */
function requireTeacher(req, res, next) {
  if (!req.session.user.isInstructor) {
    log.warn({}, `Student ${req.session.user.userId} tried to access ${req.originalUrl}`);
    res.status(401).json({ msg: "You must be an instructor to access this" }); // unauthorized
    return;
  }
  next();
}

/**
 * a middleware to make sure that the logged in user is a student
 * @param {express.Request} req the request
 * @param {express.Response} res the response
 * @param {express.NextFunction} next the function to call the next middleware
 */
function requireStudent(req, res, next) {
  if (req.session.user.isInstructor) {
    log.warn({}, `Instructor ${req.session.user.userId} tried to access ${req.originalUrl}`);
    res.status(401).json({ msg: "You must be a student to access this" }); // unauthorized
    return;
  }
  next();
}

//Backend authentication to allow use of certain endpoints
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next(); // User is authenticated, continue to next middleware
  } else {
    log.warn({}, `Unauthorized user tried to access ${req.originalUrl}`);
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

/**
 * a middleware to make sure that the logged in user made the team that is in the request parameters
 * @param {express.Request} req the request
 * @param {express.Response} res the response
 * @param {express.NextFunction} next the function to call the next middleware
 */
async function requireTeacherMadeTeam(req, res, next) {
  if (!req.params.teamId) {
    res.status(400).json({ msg: "The id of team is required for this query" });
    return;
  }
  const goodInstructor = await teacherMadeTeam(db, req.params.teamId, req.session.user.userId);

  if (goodInstructor instanceof Error) {
    res.status(500).json({ msg: goodInstructor.message });
    return;
  }

  if (!goodInstructor) {
    res.status(401).json({ msg: `You must be the teacher for this specific team to be able to access this endpoint` });
    return;
  }

  next();
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
      return;
    }

    const hash = hashQuery.rows[0].hash;
    delete hashQuery.rows[0].hash;

    const success = await argon2.verify(hash.toString(), password);

    if (!success) {
      log.warn({}, `User ${email} Failed to log in`);
      res.status(404).json({ msg: "Incorrect email or password" });
      next();
      return;
    }
    log.info({}, `User ${email} Successfully logged in`);
    req.session.user = {
      userId: hashQuery.rows[0].user_id,
      fName: hashQuery.rows[0].f_name,
      lName: hashQuery.rows[0].l_name,
      email: hashQuery.rows[0].email,
      schoolId: hashQuery.rows[0].school_id,
      role: hashQuery.rows[0].role,
      isInstructor: hashQuery.rows[0].role === "INST",
    };

    res.status(200).json({
      msg: "Successfully logged in",
      fName: req.session.user.fName,
      lName: req.session.user.lName,
      email: req.session.user.email,
      schoolId: req.session.user.schoolId,
      isInstructor: req.session.user.isInstructor,
      userId: req.session.user.userId
    });

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
      return;
    }
    log.info({}, `Successfully destroyed session for ${user.email}`);
    res.clearCookie("authentication");
    res.status(200).json({ msg: "Successfully logged out" });
  });
});

//Test whether or not you are authenticated
router.post("/test-authentication", requireAuth, (req, res) => {
  res.status(200).json({
    msg: "User is authenticated",
    isInstructor: req.session.user.isInstructor,
    userId: req.session.user.userId
  });
});

export { router, requireAuth, requireTeacher, requireStudent, requireTeacherMadeTeam };