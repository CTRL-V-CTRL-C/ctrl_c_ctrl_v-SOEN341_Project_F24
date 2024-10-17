import { db } from "../db.js";

//Populate users table
let usernum = 0;
let schoolNum = 1000;
let getUserNum = () => ++usernum;
let getSchoolNum = () => ++schoolNum;

//Make students
const numberOfStudents = 12;
for (let i = 1; i <= numberOfStudents; i++) {
  await db.query("INSERT INTO users (hash, f_name, l_name, email, school_id, role)\
   VALUES ($1,$2,$3,$4,$5,$6)", [
    "$argon2id$v=19$m=65536,t=3,p=4$hu6FGPJVFZxzd/zqI3HoEg$EUQ1Lil7Ed4TLQFOhGD1xppanajwqJae8FQmKDxPgsU",
    "joe",
    "parker",
    `joeparker${getUserNum()}@gmail.com`,
    `STUD${getSchoolNum()}`,
    "STUD"
  ]);
}
//Make professors
const numberOfInstructors = 12;
for (let i = 1; i <= numberOfInstructors; i++) {
  await db.query("INSERT INTO users (hash, f_name, l_name, email, school_id, role)\
   VALUES ($1,$2,$3,$4,$5,$6)", [
    "$argon2id$v=19$m=65536,t=3,p=4$hu6FGPJVFZxzd/zqI3HoEg$EUQ1Lil7Ed4TLQFOhGD1xppanajwqJae8FQmKDxPgsU",
    "joe",
    "parker",
    `joeparker${getUserNum()}@gmail.com`,
    `INST${getSchoolNum()}`,
    "INST"
  ]);
}

console.log("Populated users table");

//Populate Courses table
const numberOfCourses = 5;
for (let course_id = 1; course_id <= numberOfCourses; course_id++) {
  await db.query("INSERT INTO courses (course_name, instructor_id) VALUES ($1,$2)",
    [`test_course_${course_id}`, (numberOfStudents + 1 + ((course_id - 1) % (numberOfCourses - 2)))]
  );
}

console.log("Populated courses table");

//Populate Teams table
let team_id = 0;
const numberOfTeams = 3;
for (let course_id = 1; course_id <= numberOfCourses; course_id++) {
  for (let teamNum = 1; teamNum <= numberOfTeams; teamNum++) {
    await db.query("INSERT INTO teams (team_name, course_id) VALUES ($1,$2)",
      [`test_team_${course_id}_${teamNum}`, course_id]
    );
    team_id++;
    for (let index = 1; index <= numberOfStudents / numberOfTeams; index++) {
      await db.query("INSERT INTO team_members (user_id, team_id) VALUES ($1, $2)",
        [(teamNum - 1) * (numberOfStudents / numberOfTeams) + index, team_id]
      )
    }
  }
}

console.log("Populated teams table");

//Populate evaluations table
const numberOfEvaluations = 3;
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