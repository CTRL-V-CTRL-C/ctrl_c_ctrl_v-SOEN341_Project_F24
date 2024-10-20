import { db } from "../db.js";

//Populate users table
let schoolNum = 1000;
let getSchoolNum = () => ++schoolNum;

const studFNames = ["joe", "steve", "sarah", "jennifer", "lucy", "chloe", "john", "david", "samantha", "alex", "george", "gabrielle"];
const studLNames = ["parker", "austin", "mcgee", "lawrence", "luck", "wright", "doe", "star", "bobantha", "vance", "lucas", "french"];
//Make students
const numberOfStudents = 12;
for (let i = 1; i <= numberOfStudents; i++) {
  await db.query("INSERT INTO users (hash, f_name, l_name, email, school_id, role)\
   VALUES ($1,$2,$3,$4,$5,$6)", [
    "$argon2id$v=19$m=65536,t=3,p=4$hu6FGPJVFZxzd/zqI3HoEg$EUQ1Lil7Ed4TLQFOhGD1xppanajwqJae8FQmKDxPgsU",
    studFNames[i - 1],
    studLNames[i - 1],
    `${studFNames[i - 1]}${studLNames[i - 1]}@gmail.com`,
    `STUD${getSchoolNum()}`,
    "STUD"
  ]);
}

//Make professors
const numberOfInstructors = 2;
const instFNames = ["james", "amanda"];
const instLNames = ["north", "south"];
for (let i = 1; i <= numberOfInstructors; i++) {
  await db.query("INSERT INTO users (hash, f_name, l_name, email, school_id, role)\
   VALUES ($1,$2,$3,$4,$5,$6)", [
    "$argon2id$v=19$m=65536,t=3,p=4$hu6FGPJVFZxzd/zqI3HoEg$EUQ1Lil7Ed4TLQFOhGD1xppanajwqJae8FQmKDxPgsU",
    instFNames[i - 1],
    instLNames[i - 1],
    `${instFNames[i - 1]}${instLNames[i - 1]}@gmail.com`,
    `INST${getSchoolNum()}`,
    "INST"
  ]);
}

console.log("Populated users table");

//Populate Courses table
const courseNames = ["SOEN 341", "COMP 228"];
const numberOfCourses = 2;
for (let course_id = 1; course_id <= numberOfCourses; course_id++) {
  await db.query("INSERT INTO courses (course_name, instructor_id) VALUES ($1,$2)",
    [courseNames[course_id - 1], (numberOfStudents + course_id)]
  );
}

console.log("Populated courses table");

//Populate Teams table
await db.query("INSERT INTO teams (team_name, course_id) VALUES ($1,$2)",
  [`the best team`, 1]
);
for (let index = 1; index <= 6; index++) {
  await db.query("INSERT INTO team_members (user_id, team_id) VALUES ($1, $2)",
    [index, 1]
  );
}
await db.query("INSERT INTO teams (team_name, course_id) VALUES ($1,$2)",
  [`the even better team`, 1]
);
for (let index = 7; index <= 12; index++) {
  await db.query("INSERT INTO team_members (user_id, team_id) VALUES ($1, $2)",
    [index, 2]
  );
}
await db.query("INSERT INTO teams (team_name, course_id) VALUES ($1,$2)",
  [`the only team ):`, 2]
);
for (let index = 3; index <= 5; index++) {
  await db.query("INSERT INTO team_members (user_id, team_id) VALUES ($1, $2)",
    [index, 3]
  );
}

console.log("Populated teams table");

//Populate evaluations table
const numberOfEvaluations = 5;
const criteria = ['COOPERATION', 'CONCEPTUAL CONTRIBUTION', 'PRACTICAL CONTRIBUTION', 'WORK ETHIC'];
for (let eval_id = 1; eval_id <= numberOfEvaluations; eval_id++) {
  await db.query("INSERT INTO evaluations (team_id, evaluator_id, evaluatee_id) VALUES($1,$2,$3)", [1, 1, eval_id + 1]);
  let j = 1;
  for (const crit of criteria) {
    await db.query("INSERT INTO evaluation_details VALUES($1,$2,$3,$4)", [eval_id, crit, j++, "Some review"]);
  }
}
console.log("Populated evaluations table")

db.end();