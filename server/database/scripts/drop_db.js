import { db } from "../db.js";

//Drop users table
await db.query("DROP TABLE IF EXISTS users");

console.log("Dropped users table");

//TODO: Drop Courses table

//TODO: Drop Teams table

db.end();