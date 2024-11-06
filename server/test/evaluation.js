import { suite, it, after, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { app } from '../server.js';
import { db } from '../database/db.js';
import { createUser } from '../database/API.js';
import { createCourse } from '../database/course.js';
import { createTeam } from '../database/team.js';
import { createOrUpdateEvaluation } from '../database/evaluation.js';
import log from '../logger.js';

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
    await request(app).post("/api/user/create").set("Accept", "application/json").send(user).expect(200).timeout(1000);
    user.role = "STUD"; user.schoolID = "STUD2000"; user.email = "test.student1@mail.com";
    await request(app).post("/api/user/create").set("Accept", "application/json").send(user).expect(200).timeout(1000);
    user.schoolID = "STUD2001"; user.email = "test.student2@mail.com";
    await request(app).post("/api/user/create").set("Accept", "application/json").send(user).expect(200).timeout(1000);
    const instructorId = (await db.query("SELECT user_id FROM users WHERE school_id = 'INST2000'")).rows[0].user_id;
    studentId2 = (await db.query("SELECT user_id FROM users WHERE school_id = 'STUD2001'")).rows[0].user_id;
    courseId = await createCourse(db, instructorId, "The test course");
    teamId = await createTeam(db, courseId, "The test team", ["test.student1@mail.com", "test.student2@mail.com"]);
    cookies = await loginUser("test.student1@mail.com", "password");
  });

  after(async () => {
    await logoutUser(cookies);
    await db.query("DELETE FROM users WHERE email = 'test.student1@mail.com' OR email = 'test.student2@mail.com' OR email = 'test.instructor1@mail.com'");
  });

  it("Should respond with 200 when evaluating a student in the same team", async (t) => {
    const response = await request(app)
      .post("/api/evaluation/evaluate")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .send({ team_id: teamId, user_id: studentId2, evaluation_details: [{ criteria: "COOPERATION", rating: 1, comment: "" }, { criteria: "CONCEPTUAL CONTRIBUTION", rating: 1, comment: "" }, { criteria: "PRACTICAL CONTRIBUTION", rating: 1, comment: "" }, { criteria: "WORK ETHIC", rating: 1, comment: "" }] })
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 200);
  });

  it("Should respond with 200 when re-evaluating a student in the same team", async (t) => {
    const response = await request(app)
      .post("/api/evaluation/evaluate")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .send({ team_id: teamId, user_id: studentId2, evaluation_details: [{ criteria: "COOPERATION", rating: 2, comment: "Hey" }, { criteria: "CONCEPTUAL CONTRIBUTION", rating: 1, comment: "" }, { criteria: "PRACTICAL CONTRIBUTION", rating: 1, comment: "" }, { criteria: "WORK ETHIC", rating: 1, comment: "" }] })
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 200);
  });

  it("Should respond with 400 when evaluating a student they are not in a team with", async (t) => {
    const response = await request(app)
      .post("/api/evaluation/evaluate")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .send({ team_id: teamId, user_id: studentId2 + 1, evaluation_details: [{ criteria: "COOPERATION", rating: 1, comment: "" }] })
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 400);
  });

  it("Should respond with 400 when evaluating a student with invalid rating", async (t) => {
    const response = await request(app)
      .post("/api/evaluation/evaluate")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .send({ team_id: teamId, user_id: studentId2, evaluation_details: [{ criteria: "COOPERATION", rating: 7, comment: "" }] })
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 400);
  });

  it("Should respond with 400 when evaluating a student with invalid criteria", async (t) => {
    const response = await request(app)
      .post("/api/evaluation/evaluate")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .send({ team_id: teamId, user_id: studentId2, evaluation_details: [{ criteria: "COOPERATION STUFF", rating: 2, comment: "" }] })
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 400);
  });

  it("Should respond with 400 when evaluating a student with an invalid evaluation (missing criteria)", async (t) => {
    const response = await request(app)
      .post("/api/evaluation/evaluate")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .send({ team_id: teamId, user_id: studentId2, evaluation_details: [{ criteria: "COOPERATION", rating: 2, comment: "" }] })
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 400);
    assert.match(response._body.msg, /[Mm]issing/);
  });

  it("Should respond with 400 when evaluating a student with an invalid evaluation (duplicate criteria)", async (t) => {
    const response = await request(app)
      .post("/api/evaluation/evaluate")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .send({ team_id: teamId, user_id: studentId2, evaluation_details: [{ criteria: "COOPERATION", rating: 2, comment: "" }, { criteria: "COOPERATION", rating: 2, comment: "Hey" }, { criteria: "CONCEPTUAL CONTRIBUTION", rating: 1, comment: "" }, { criteria: "PRACTICAL CONTRIBUTION", rating: 1, comment: "" }, { criteria: "WORK ETHIC", rating: 1, comment: "" }] })
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 400);
    assert.match(response._body.msg, /[Dd]uplicate/);
  });

  it("Should respond with 200 when getting an evaluation for a student in the same team", async (t) => {
    const response = await request(app)
      .get(`/api/evaluation/get-my-evaluation/${teamId}/${studentId2}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 200);
    assert.equal(response._body.length, 4);
  });

  it("Should respond with 400 when getting an evaluation for a student in not in the same team", async (t) => {
    const response = await request(app)
      .get(`/api/evaluation/get-my-evaluation/${teamId}/${studentId2 + 1}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 400);
  });


});


suite("POST and GET evaluations as an instructor (The dashboard)", async () => {
  let cookies;
  let courseId;
  let teamId;
  let instructorId;
  let studentId1;
  let studentId2;
  let studentId3;

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

    user.schoolID = "STUD2005"; user.email = "test.student5@mail.com";
    await request(app).post("/api/user/create").set("Accept", "application/json").send(user).expect(200).timeout(1000);

    user.schoolID = "STUD2006"; user.email = "test.student6@mail.com";
    await request(app).post("/api/user/create").set("Accept", "application/json").send(user).expect(200).timeout(1000);
  }

  async function setUserIds() {
    instructorId = (await db.query("SELECT user_id FROM users WHERE school_id = 'INST2002'")).rows[0].user_id;
    studentId1 = (await db.query("SELECT user_id FROM users WHERE school_id = 'STUD2004'")).rows[0].user_id;
    studentId2 = (await db.query("SELECT user_id FROM users WHERE school_id = 'STUD2005'")).rows[0].user_id;
    studentId3 = (await db.query("SELECT user_id FROM users WHERE school_id = 'STUD2006'")).rows[0].user_id;
  }

  async function createTestScenario() {
    courseId = await createCourse(db, instructorId, "The test course 2");
    teamId = await createTeam(db, courseId, "The test team", ["test.student4@mail.com", "test.student5@mail.com", "test.student6@mail.com"]);
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

  it("Should respond with 200 when getting the summary of evaluations", async (t) => {
    const response = await request(app)
      .get(`/api/evaluation/get-summary/${teamId}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 200);
  });

  it("Should respond with the correct average and count for the summary of evaluations", async (t) => {
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
      .get(`/api/evaluation/get-summary/${teamId}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 200);
    assert.deepEqual(response._body, summary);

  });

  it("Should respond with 400 when getting the evaluation summary of a team not in your course", async (t) => {
    const response = await request(app)
      .get(`/api/evaluation/get-summary/${teamId + 1}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 400);
  });

  it("Should respond with 200 when getting the evaluation details for a specific team", async () => {
    const expected = {
      evaluatee_name: "john smith",
      evaluatee_school_id: "STUD2005",
      evaluations: [
        {
          evaluatior_name: "john smith",
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
          evaluator_school_id: "STUD2004",
        },
        {
          evaluatior_name: "john smith",
          average_rating: 3,
          ratings: [
            {
              criteria: "COOPERATION",
              rating: 2,
              comment: "",
            },
            {
              criteria: "CONCEPTUAL CONTRIBUTION",
              rating: 4,
              comment: "",
            },
            {
              criteria: "PRACTICAL CONTRIBUTION",
              rating: 5,
              comment: "",
            },
            {
              criteria: "WORK ETHIC",
              rating: 1,
              comment: "",
            },
          ],
          evaluator_school_id: "STUD2006",
        },
      ],
      count: 2,
    };

    const response = await request(app)
      .get(`/api/evaluation/get-details/${teamId}/STUD2005`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000);

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, expected);
  });

  it("Should respond with 400 when getting the evaluation detailed of a team not in your course", async (t) => {
    const response = await request(app)
      .get(`/api/evaluation/get-summary/${teamId + 1}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 400);
  });
});