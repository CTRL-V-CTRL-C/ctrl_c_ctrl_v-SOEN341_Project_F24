import fs from 'node:fs'
import { db } from "../db.js";

//Create users table
await db.query(fs.readFileSync(import.meta.dirname + "/sql/users.sql").toString());
console.log("Created users table");

//Create Courses table
await db.query(fs.readFileSync(import.meta.dirname + "/sql/courses.sql").toString());
console.log("Created courses table");

//Create Teams table
await db.query(fs.readFileSync(import.meta.dirname + "/sql/teams.sql").toString());
console.log("Created teams table");

db.end();