import { suite, it, after, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { app } from '../server.js';
import { db } from '../database/db.js';
import { createUser } from '../database/API.js';
import { createCourse } from '../database/course.js';
import { createTeam } from '../database/team.js';

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

//Tests based on populate scripts
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
      .send({ team_id: teamId, user_id: studentId2, evaluation_details: [{ criteria: "COOPERATION", rating: 1, comment: "" }] })
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 200);
  });

  it("Should respond with 200 when re-evaluating a student in the same team", async (t) => {
    const response = await request(app)
      .post("/api/evaluation/evaluate")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .send({ team_id: teamId, user_id: studentId2, evaluation_details: [{ criteria: "COOPERATION", rating: 2, comment: "Hey" }] })
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

  it("Should respond with 200 when getting an evaluation for a student in the same team", async (t) => {
    const response = await request(app)
      .get(`/api/evaluation/get-my-evaluation/${teamId}/${studentId2}`)
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 200);
    assert.equal(response._body.length, 1);
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