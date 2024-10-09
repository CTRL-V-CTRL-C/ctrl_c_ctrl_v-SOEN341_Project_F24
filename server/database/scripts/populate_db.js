import { db } from "../db.js";

//Populate users table
let usernum = 0;
let schoolNum = 1000;
let getUserNum = () => ++usernum;
let getSchoolNum = () => ++schoolNum;
const getRandomNumber = (min, max) => (Math.random() * (max - min)) + min;
const getRandomInt = (min, max) => Math.floor(getRandomNumber(min, max));

//Make students
for (let i = 0; i < 11; i++) {
  await db.query("INSERT INTO users (hash, f_name, l_name, email, school_id, role)\
   VALUES ($1,$2,$3,$4,$5,$6)", [
    "$argon2id$v=19$m=65536,t=3,p=4$hu6FGPJVFZxzd/zqI3HoEg$EUQ1Lil7Ed4TLQFOhGD1xppanajwqJae8FQmKDxPgsU",
    "Joe",
    "Parker",
    `JoeParker${getUserNum()}@gmail.com`,
    `STUD${getSchoolNum()}`,
    "STUD"
  ]);
}
//Make professors
for (let i = 0; i < 11; i++) {
  await db.query("INSERT INTO users (hash, f_name, l_name, email, school_id, role)\
   VALUES ($1,$2,$3,$4,$5,$6)", [
    "$argon2id$v=19$m=65536,t=3,p=4$hu6FGPJVFZxzd/zqI3HoEg$EUQ1Lil7Ed4TLQFOhGD1xppanajwqJae8FQmKDxPgsU",
    "Joe",
    "Parker",
    `JoeParker${getUserNum()}@gmail.com`,
    `INST${getSchoolNum()}`,
    "INST"
  ]);
}

console.log("Populated users table");

//Populate Courses table
const numberOfCourses = 5;
for (let course_id = 1; course_id <= numberOfCourses; course_id++) {
  await db.query("INSERT INTO courses (course_name, instructor_id) VALUES ($1,$2)",
    [`test_course_${course_id}`, getRandomInt(12, 22)]
  );
}

console.log("Populated courses table");

//Populate Teams table
const numberOfTeams = 10;
for (let team_id = 1; team_id <= numberOfTeams; team_id++) {
  await db.query("INSERT INTO teams (team_name, course_id) VALUES ($1,$2)",
    [`test_team_${team_id}`, getRandomInt(1, numberOfCourses)]
  );
  for (let index = 0; index < getRandomInt(1, 5); index++) {
    await db.query("INSERT INTO team_members (user_id, team_id) VALUES ($1, $2)",
      [getRandomInt(1, 11), team_id]
    )
  }
}

console.log("populated the teams");

db.end();