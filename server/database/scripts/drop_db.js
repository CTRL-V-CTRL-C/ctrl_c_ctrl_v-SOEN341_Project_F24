import fs from 'node:fs'
import { db } from "../db.js";

// Drop Evaluations
await db.query(fs.readFileSync(import.meta.dirname + "/sql/evaluations_drop.sql").toString());
console.log("Dropped evaluations");

// Drop teams
await db.query(fs.readFileSync(import.meta.dirname + "/sql/teams_drop.sql").toString());
console.log("Dropped teams");

// Drop Evaluations
await db.query(fs.readFileSync(import.meta.dirname + "/sql/documents_drop.sql").toString());
console.log("Dropped documents");

//Drop Courses table
await db.query(fs.readFileSync(import.meta.dirname + "/sql/courses_drop.sql").toString());
console.log("Dropped courses table");

//Drop users table
await db.query(fs.readFileSync(import.meta.dirname + "/sql/users_drop.sql").toString());
console.log("Dropped users table");

db.end();