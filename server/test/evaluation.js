import { suite, it, after, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { app } from '../server.js';
import { db } from '../database/db.js';
import { createCourse } from '../database/course.js';
import { createTeam } from '../database/team.js';
import { createOrUpdateEvaluation } from '../database/evaluation.js';
import { createUserAPI, UserRole } from './apiUtils.js';
import { randomLetters } from './utils.js';

async function loginUser(email, password) {
  const response = await request(app)
    .post("/api/login")
    .set("Accept", "application/json")
    .send({ email, password })
    .expect(200);
  return response.headers['set-cookie'];
}

async function logoutUser(cookies) {
  const response = await request(app)
    .post("/api/logout")
    .set("Accept", "application/json")
    .set("Cookie", cookies)
    .expect(200);
  return response.headers['set-cookie'];
}

suite("POST and GET evaluations as a student", async () => {
  let cookies;
  let courseId;
  let teamId;
  let studentId2;


  before(async () => {
    const user = {
      password: "password",
      firstName: "John",
      lastName: "Smith",
      email: `test.instructor1@mail.com`,
      schoolID: `INST2000`,
      role: "INST"
    }
    const team = [];
    await request(app).post("/api/user/create").set("Accept", "application/json").send(user).expect(200).timeout(1000);
    user.role = "STUD"; user.schoolID = "STUD2000"; user.email = "test.student1@mail.com";
    team.push({ ...user });
    await request(app).post("/api/user/create").set("Accept", "application/json").send(user).expect(200).timeout(1000);
    user.schoolID = "STUD2001"; user.email = "test.student2@mail.com";
    await request(app).post("/api/user/create").set("Accept", "application/json").send(user).expect(200).timeout(1000);
    team.push({ ...user });
    const instructorId = (await db.query("SELECT user_id FROM users WHERE school_id = 'INST2000'")).rows[0].user_id;
    studentId2 = (await db.query("SELECT user_id FROM users WHERE school_id = 'STUD2001'")).rows[0].user_id;
    courseId = await createCourse(db, instructorId, "The test course");
    teamId = await createTeam(db, courseId, "The test team", team);

    cookies = await loginUser("test.student1@mail.com", "password");
  });

  after(async () => {
    await logoutUser(cookies);
    await db.query("DELETE FROM users WHERE email = 'test.student1@mail.com' OR email = 'test.student2@mail.com' OR email = 'test.instructor1@mail.com'");
  });

  it("Should respond with 200 when evaluating a student in the same team", async () => {
    const response = await request(app)
      .post("/api/evaluation/evaluate")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .send({ team_id: teamId, user_id: studentId2, evaluation_details: [{ criteria: "COOPERATION", rating: 1, comment: "" }, { criteria: "CONCEPTUAL CONTRIBUTION", rating: 1, comment: "" }, { criteria: "PRACTICAL CONTRIBUTION", rating: 1, comment: "" }, { criteria: "WORK ETHIC", rating: 1, comment: "" }] })
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 200, response.body.msg);
    assert.match(response.headers["content-type"], /json/);
  });

  it("Should respond with 200 when re-evaluating a student in the same team", async () => {
    const response = await request(app)
      .post("/api/evaluation/evaluate")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .send({ team_id: teamId, user_id: studentId2, evaluation_details: [{ criteria: "COOPERATION", rating: 2, comment: "Hey" }, { criteria: "CONCEPTUAL CONTRIBUTION", rating: 1, comment: "" }, { criteria: "PRACTICAL CONTRIBUTION", rating: 1, comment: "" }, { criteria: "WORK ETHIC", rating: 1, comment: "" }] })
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 200, response.body.msg);
    assert.match(response.headers["content-type"], /json/);
  });

  it("Should respond with 400 when evaluating a student they are not in a team with", async () => {
    const response = await request(app)
      .post("/api/evaluation/evaluate")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .send({ team_id: teamId, user_id: studentId2 + 1, evaluation_details: [{ criteria: "COOPERATION", rating: 1, comment: "" }] })
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 400, response.body.msg);
    assert.match(response.headers["content-type"], /json/);
  });

  it("Should respond with 400 when evaluating a student with invalid rating", async () => {
    const response = await request(app)
      .post("/api/evaluation/evaluate")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .send({ team_id: teamId, user_id: studentId2, evaluation_details: [{ criteria: "COOPERATION", rating: 7, comment: "" }] })
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 400, response.body.msg);
    assert.match(response.headers["content-type"], /json/);
  });

  it("Should respond with 400 when evaluating a student with invalid criteria", async () => {
    const response = await request(app)
      .post("/api/evaluation/evaluate")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .send({ team_id: teamId, user_id: studentId2, evaluation_details: [{ criteria: "COOPERATION STUFF", rating: 2, comment: "" }] })
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 400, response.body.msg);
    assert.match(response.headers["content-type"], /json/);
  });

  it("Should respond with 400 when evaluating a student with an invalid evaluation (missing criteria)", async () => {
    const response = await request(app)
      .post("/api/evaluation/evaluate")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .send({ team_id: teamId, user_id: studentId2, evaluation_details: [{ criteria: "COOPERATION", rating: 2, comment: "" }] })
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 400, response.body.msg);
    assert.match(response.headers["content-type"], /json/);
    assert.match(response._body.msg, /[Mm]issing/);
  });

  it("Should respond with 400 when evaluating a student with an invalid evaluation (duplicate criteria)", async () => {
    const response = await request(app)
      .post("/api/evaluation/evaluate")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .send({ team_id: teamId, user_id: studentId2, evaluation_details: [{ criteria: "COOPERATION", rating: 2, comment: "" }, { criteria: "COOPERATION", rating: 2, comment: "Hey" }, { criteria: "CONCEPTUAL CONTRIBUTION", rating: 1, comment: "" }, { criteria: "PRACTICAL CONTRIBUTION", rating: 1, comment: "" }, { criteria: "WORK ETHIC", rating: 1, comment: "" }] })
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 400, response.body.msg);
    assert.match(response.headers["content-type"], /json/);
    assert.match(response._body.msg, /[Dd]uplicate/);
  });

  it("Should respond with 200 when getting an evaluation for a student in the same team", async () => {
    const response = await request(app)
      .get(`/api/evaluation/get-my-evaluation/${teamId}/${studentId2}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 200, response.body.msg);
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response._body.length, 4);
  });

  it("Should respond with 400 when getting an evaluation for a student in not in the same team", async () => {
    const response = await request(app)
      .get(`/api/evaluation/get-my-evaluation/${teamId}/${studentId2 + 1}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 400, response.body.msg);
    assert.match(response.headers["content-type"], /json/);
  });
});


suite("GET evaluations summary as an instructor (both team and course)", async () => {
  let cookies;
  let courseId;
  let teamId;
  let instructorId;
  let studentId1;
  let studentId2;
  let studentId3;
  let team = [];

  async function createTestUsers() {
    const user = {
      password: "password",
      firstName: "John",
      lastName: "Smith",
      email: `test.instructor2@mail.com`,
      schoolID: `INST2002`,
      role: "INST"
    }
    await request(app).post("/api/user/create").set("Accept", "application/json").send(user).expect(200).timeout(1000);

    user.role = "STUD"; user.schoolID = "STUD2004"; user.email = "test.student4@mail.com";
    await request(app).post("/api/user/create").set("Accept", "application/json").send(user).expect(200).timeout(1000);

    team.push({ ...user });
    user.schoolID = "STUD2005"; user.email = "test.student5@mail.com";
    await request(app).post("/api/user/create").set("Accept", "application/json").send(user).expect(200).timeout(1000);

    team.push({ ...user });
    user.schoolID = "STUD2006"; user.email = "test.student6@mail.com";
    await request(app).post("/api/user/create").set("Accept", "application/json").send(user).expect(200).timeout(1000);
    team.push({ ...user });
  }

  async function setUserIds() {
    instructorId = (await db.query("SELECT user_id FROM users WHERE school_id = 'INST2002'")).rows[0].user_id;
    studentId1 = (await db.query("SELECT user_id FROM users WHERE school_id = 'STUD2004'")).rows[0].user_id;
    studentId2 = (await db.query("SELECT user_id FROM users WHERE school_id = 'STUD2005'")).rows[0].user_id;
    studentId3 = (await db.query("SELECT user_id FROM users WHERE school_id = 'STUD2006'")).rows[0].user_id;
  }

  async function createTestScenario() {
    courseId = await createCourse(db, instructorId, "The test course 2");
    teamId = await createTeam(db, courseId, "The test team", team);
    await createOrUpdateEvaluation(db, studentId1, studentId2, teamId, [{ criteria: "COOPERATION", rating: 1, comment: "" }, { criteria: "CONCEPTUAL CONTRIBUTION", rating: 1, comment: "" }, { criteria: "PRACTICAL CONTRIBUTION", rating: 1, comment: "" }, { criteria: "WORK ETHIC", rating: 1, comment: "" }]);
    await createOrUpdateEvaluation(db, studentId3, studentId2, teamId, [{ criteria: "COOPERATION", rating: 2, comment: "" }, { criteria: "CONCEPTUAL CONTRIBUTION", rating: 4, comment: "" }, { criteria: "PRACTICAL CONTRIBUTION", rating: 5, comment: "" }, { criteria: "WORK ETHIC", rating: 1, comment: "" }]);
  }

  before(async () => {
    await createTestUsers();
    await setUserIds();
    await createTestScenario();
    cookies = await loginUser("test.instructor2@mail.com", "password");
  });

  after(async () => {
    await logoutUser(cookies);
    await db.query("DELETE FROM users WHERE email = 'test.student4@mail.com' OR email = 'test.student5@mail.com' OR email = 'test.student6@mail.com' OR email = 'test.instructor2@mail.com'");
  });

  it("Should respond with 200 when getting the summary of evaluations for a team", async () => {
    const response = await request(app)
      .get(`/api/evaluation/get-team-summary/${teamId}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 200, response.body.msg);
    assert.match(response.headers["content-type"], /json/);
  });

  it("Should respond with the correct average and count for the summary of evaluations for a team", async () => {
    const summary = [
      {
        school_id: "STUD2004",
        f_name: "john",
        l_name: "smith",
        team_name: "The test team",
        ratings: [
          {
            criteria: null,
            average_rating: null,
          },
        ],
        average: null,
        count: 0,
      },
      {
        school_id: "STUD2005",
        f_name: "john",
        l_name: "smith",
        team_name: "The test team",
        ratings: [
          {
            criteria: "COOPERATION",
            average_rating: 1.5,
          },
          {
            criteria: "CONCEPTUAL CONTRIBUTION",
            average_rating: 2.5,
          },
          {
            criteria: "PRACTICAL CONTRIBUTION",
            average_rating: 3,
          },
          {
            criteria: "WORK ETHIC",
            average_rating: 1,
          },
        ],
        average: 2,
        count: 2,
      },
      {
        school_id: "STUD2006",
        f_name: "john",
        l_name: "smith",
        team_name: "The test team",
        ratings: [
          {
            criteria: null,
            average_rating: null,
          },
        ],
        average: null,
        count: 0,
      },
    ]
    const response = await request(app)
      .get(`/api/evaluation/get-team-summary/${teamId}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 200, response.body.msg);
    assert.match(response.headers["content-type"], /json/);
    assert.deepEqual(response._body, summary);
  });

  it("Should respond with 401 when getting the evaluation summary of a team not in your course", async () => {
    const response = await request(app)
      .get(`/api/evaluation/get-team-summary/${teamId + 1}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 401, response.body.msg);
    assert.match(response.headers["content-type"], /json/);
  });

  it("Should respond with 200 when getting the summary of evaluations for a course", async () => {
    const response = await request(app)
      .get(`/api/evaluation/get-course-summary/${courseId}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 200, response.body.msg);
    assert.match(response.headers["content-type"], /json/);
  });

  it("Should respond with the correct average and count for the summary of evaluations for a course", async () => {
    const summary = [
      {
        school_id: "STUD2004",
        team_name: "The test team",
        count: 0,
        f_name: "john",
        l_name: "smith",
        average: null,
        ratings: [
          {
            criteria: null,
            average_rating: null,
          }
        ]
      },
      {
        school_id: "STUD2005",
        team_name: "The test team",
        count: 2,
        f_name: "john",
        l_name: "smith",
        average: 2,
        ratings: [
          {
            criteria: "COOPERATION",
            average_rating: 1.5,
          },
          {
            criteria: "CONCEPTUAL CONTRIBUTION",
            average_rating: 2.5,
          },
          {
            criteria: "PRACTICAL CONTRIBUTION",
            average_rating: 3,
          },
          {
            criteria: "WORK ETHIC",
            average_rating: 1,
          },
        ]
      },
      {
        school_id: "STUD2006",
        team_name: "The test team",
        count: 0,
        f_name: "john",
        l_name: "smith",
        average: null,
        ratings: [
          {
            criteria: null,
            average_rating: null,
          }
        ]
      },
    ]
    const response = await request(app)
      .get(`/api/evaluation/get-course-summary/${courseId}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 200, response.body.msg);
    assert.match(response.headers["content-type"], /json/);
    assert.deepEqual(response._body, summary);

  });

  it("Should respond with 401 when getting the evaluation summary of a course you do not teach", async () => {
    const response = await request(app)
      .get(`/api/evaluation/get-course-summary/${courseId + 1}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 401, response.body.msg);
    assert.match(response.headers["content-type"], /json/);
  });
});

suite("GET evaluation details as an instructor (both team and course)", async () => {
  const testUsers = [];
  let teacher;
  let teamId;
  let cookies;

  async function setupUsers() {
    teacher = await createUserAPI(app, UserRole.Instructor);
    const userId = (await db.query(`SELECT user_id FROM users WHERE school_id = '${teacher.schoolID}'`)).rows[0].user_id;
    teacher.userId = userId;
    for (let i = 0; i < 5; i++) {
      const user = await createUserAPI(app, UserRole.Student);
      const userId = (await db.query(`SELECT user_id FROM users WHERE school_id = '${user.schoolID}'`)).rows[0].user_id;
      user.userId = userId;
      testUsers.push(user);
    }
  }


  before(async () => {
    await setupUsers();
    const courseId = await createCourse(db, teacher.userId, "test course" + randomLetters());
    teamId = await createTeam(db, courseId, randomLetters(), testUsers);
    for (let i = 0; i < 4; i++) {
      await createOrUpdateEvaluation(db, testUsers[i].userId, testUsers[i + 1].userId, teamId, [{ criteria: "COOPERATION", rating: i + 1, comment: "" }, { criteria: "CONCEPTUAL CONTRIBUTION", rating: i + 1, comment: "" }, { criteria: "PRACTICAL CONTRIBUTION", rating: i + 1, comment: "" }, { criteria: "WORK ETHIC", rating: i + 1, comment: "" }]);
    }
    cookies = await loginUser(teacher.email, teacher.password);
  });


  after(async () => {
    await logoutUser(cookies);
    testUsers.push(teacher);
    const orQuery = testUsers
      .map(user => user.userId)
      .reduce((accumulator, current, i) => {
        if (i == 0) {
          return `user_id = ${current} `;
        }
        return accumulator + ` OR user_id =  ${current} `
      }, "")
    await db.query("DELETE FROM users WHERE " + orQuery + ";");
  })

  it("Should respond with 200 when getting the evaluation details for a specific team", async () => {
    const expected = {
      evaluatee_name: "john smith",
      evaluatee_school_id: testUsers[1].schoolID,
      evaluations: [
        {
          evaluator_name: "john smith",
          average_rating: 1,
          ratings: [
            {
              criteria: "COOPERATION",
              rating: 1,
              comment: "",
            },
            {
              criteria: "CONCEPTUAL CONTRIBUTION",
              rating: 1,
              comment: "",
            },
            {
              criteria: "PRACTICAL CONTRIBUTION",
              rating: 1,
              comment: "",
            },
            {
              criteria: "WORK ETHIC",
              rating: 1,
              comment: "",
            },
          ],
          evaluator_school_id: testUsers[0].schoolID,
        },
      ],
      count: 1,
    }

    const response = await request(app)
      .get(`/api/evaluation/get-team-details/${teamId}/${testUsers[1].schoolID}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000);

    assert.equal(response.status, 200, response.body.msg);
    assert.deepEqual(response.body, expected, response.body.msg);
  });

  it("Should respond with 401 when getting a team that is not form this teacher", async () => {
    const response = await request(app)
      .get(`/api/evaluation/get-team-details/${teamId + 1}/${testUsers[0].schoolID}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000);

    assert.equal(response.status, 401, response.body.msg);
  });

  it("Should respond with 400 when a user is not part of that team", async () => {
    const response = await request(app)
      .get(`/api/evaluation/get-team-details/${teamId}/STUD0001`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000);

    assert.equal(response.status, 400, response.body.msg);
  });

  it("Should return an empty body when a user does not have any reviews", async () => {
    const response = await request(app)
      .get(`/api/evaluation/get-team-details/${teamId}/${testUsers[0].schoolID}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000);

    assert.equal(response.status, 200, response.body.msg);
    assert.ok(response.body === '');
  });
})