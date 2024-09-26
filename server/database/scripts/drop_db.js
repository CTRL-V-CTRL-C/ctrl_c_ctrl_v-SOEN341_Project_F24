import fs from 'node:fs'
import { db } from "../db.js";

// Drop teams
await db.query(fs.readFileSync(import.meta.dirname + "/sql/teams_drop.sql").toString());
console.log("Dropped teams");

//Drop users table
await db.query(fs.readFileSync(import.meta.dirname + "/sql/users_drop.sql").toString());

console.log("Dropped users table");

//TODO: Drop Courses table


db.end();