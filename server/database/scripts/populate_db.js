import { db } from "../db.js";

//Populate users table
let usernum = 0;
let schoolNum = 10000000;
let getUserNum = () => ++usernum;
let getSchoolNum = () => ++schoolNum;

//Make students
for (let i = 0; i < 11; i++) {
  await db.query("INSERT INTO users (username, hash, salt, f_name, l_name, school_id, role)\
   VALUES ($1,$2,$3,$4,$5,$6,$7)", [
    "user" + getUserNum(),
    "4d2f87e14f62b3bc58e97d0d0002bd6b",
    "superlongsalt123",
    "Joe",
    "Parker",
    getSchoolNum(),
    "STUD"
  ]);
}
//Make professors
for (let i = 0; i < 11; i++) {
  await db.query("INSERT INTO users (username, hash, salt, f_name, l_name, school_id, role)\
   VALUES ($1,$2,$3,$4,$5,$6,$7)", [
    "user" + getUserNum(),
    "4d2f87e14f62b3bc58e97d0d0002bd6b",
    "superlongsalt123",
    "Joe",
    "Parker",
    getSchoolNum(),
    "INST"
  ]);
}

console.log("Populated users table");

//TODO: Populate Courses table

//TODO: Populate Teams table

db.end();