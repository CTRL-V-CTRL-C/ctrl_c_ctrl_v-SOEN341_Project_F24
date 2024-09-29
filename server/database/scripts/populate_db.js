import { db } from "../db.js";

//Populate users table
let usernum = 0;
let schoolNum = 10000000;
let getUserNum = () => ++usernum;
let getSchoolNum = () => ++schoolNum;
const getRandomNumber = (min, max) => (Math.random() * (max - min)) + min;
const getRandomInt = (min, max) => Math.floor(getRandomNumber(min, max));

//Make students
for (let i = 0; i < 11; i++) {
  await db.query("INSERT INTO users (username, hash, f_name, l_name, email, school_id, role)\
   VALUES ($1,$2,$3,$4,$5,$6,$7)", [
    "user" + getUserNum(),
    "$argon2id$v=19$m=65536,t=3,p=4$hu6FGPJVFZxzd/zqI3HoEg$EUQ1Lil7Ed4TLQFOhGD1xppanajwqJae8FQmKDxPgsU",
    "Joe",
    "Parker",
    `JoeParker${usernum}@gmail.com`,
    getSchoolNum(),
    "STUD"
  ]);
}
//Make professors
for (let i = 0; i < 11; i++) {
  await db.query("INSERT INTO users (username, hash, f_name, l_name, email, school_id, role)\
   VALUES ($1,$2,$3,$4,$5,$6,$7)", [
    "user" + getUserNum(),
    "$argon2id$v=19$m=65536,t=3,p=4$hu6FGPJVFZxzd/zqI3HoEg$EUQ1Lil7Ed4TLQFOhGD1xppanajwqJae8FQmKDxPgsU",
    "Joe",
    "Parker",
    `JoeParker${usernum}@gmail.com`,
    getSchoolNum(),
    "INST"
  ]);
}

console.log("Populated users table");

//TODO: Populate Courses table

//TODO: Populate Teams table

const numberOfTeams = 10;
for (let team_id = 1; team_id <= numberOfTeams; team_id++) {
  await db.query("INSERT INTO teams (team_name) VALUES ($1)",
    [`test_team_${team_id}`]
  );
  for (let index = 0; index < getRandomInt(1, 5); index++) {
    await db.query("INSERT INTO team_members (user_id, team_id) VALUES ($1, $2)",
      [getRandomInt(1, 11), team_id]
    )
  }
}

console.log("populated the teams");

db.end();