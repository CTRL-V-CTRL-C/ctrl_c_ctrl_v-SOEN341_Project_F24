import express from 'express';
import session from 'express-session';
import sessionStore from 'connect-pg-simple';
import { db } from '../database/db.js';
import dotenv from 'dotenv';
import log from '../logger.js';
dotenv.config();

const router = express.Router();

const jsonConfigs = {
  limit: 50 * 1000, // 50 kb max json limit
};

router.use(express.json(jsonConfigs));

router.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.PROD, maxAge: 1800 },
}));

router.post("/login", async (req, res) => {
  let username = req.body.username;
  let hash = req.body.hash;
  try {
    let query = await db.query("SELECT * FROM users WHERE username = $1 AND hash = $2", [username, hash]);
    if (query.rows.length != 1) {
      res.sendStatus(404);
    } else {
      res.json(query.rows[0]);
    }
  } catch (error) {
    log.error(error, `Something went wrong trying to log in for user ${username}`);
    res.sendStatus(500);
  }
});

router.post("/login/get-salt", async (req, res) => {
  let username = req.body.username;
  try {
    let query = await db.query("SELECT salt FROM users WHERE username = $1", [username]);
    if (query.rows.length != 1) {
      res.sendStatus(404);
    } else {
      res.json({
        username: username,
        salt: query.rows[0].salt,
      });
    }
  } catch (error) {
    log.error(error, `Something went wrong trying to fetch the salt for user ${username}`);
    res.sendStatus(500);
  }
});

export { router };