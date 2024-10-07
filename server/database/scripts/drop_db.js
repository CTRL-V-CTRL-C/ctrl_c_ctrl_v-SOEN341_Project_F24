import fs from 'node:fs'
import { db } from "../db.js";

// Drop teams
await db.query(fs.readFileSync(import.meta.dirname + "/sql/teams_drop.sql").toString());
console.log("Dropped teams");

//Drop Courses table
await db.query(fs.readFileSync(import.meta.dirname + "/sql/courses_drop.sql").toString());
console.log("Dropped courses table");

//Drop users table
await db.query(fs.readFileSync(import.meta.dirname + "/sql/users_drop.sql").toString());
console.log("Dropped users table");

db.end();