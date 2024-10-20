import { suite, it, after, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { app } from '../server.js';
import { db } from '../database/db.js';
import { randomLetters, randomNumber } from './utils.js'


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
suite("GET teams as an instructor", async () => {
  let cookies;


  // disconnect from the database after the tests
  after(async () => {
    await logoutUser(cookies);
  });

  before(async () => {
    cookies = await loginUser("joeparker13@gmail.com", "password");
  });

  it("Should respond with 200 when getting teams in a course they teach", async (t) => {
    const response = await request(app)
      .get("/api/team/get-teams/1")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 200);
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response._body.length, 3);
  });

  it("Should respond with 401 when getting teams in a course that they don't teach", async (t) => {
    const response = await request(app)
      .get("/api/team/get-teams/2")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 401);
    assert.match(response.headers["content-type"], /json/);
  });

  it("Should respond with 401 when getting my team", async (t) => {
    const response = await request(app)
      .get("/api/team/get-my-team/1")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 401);
    assert.match(response.headers["content-type"], /json/);
  });

});

suite("GET my team and other teams as a student", async () => {
  let cookies;

  // disconnect from the database after the tests
  after(async () => {
    await logoutUser(cookies);
  });

  before(async () => {
    cookies = await loginUser("joeparker1@gmail.com", "password");
  });

  it("Should respond with 200 when getting other teams in a course they are part of", async (t) => {
    const response = await request(app)
      .get("/api/team/get-teams/1")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 200);
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response._body.length, 2);
  });

  it("Should respond with 401 when getting teams in a course they are not part of", async (t) => {
    const response = await request(app)
      .get("/api/team/get-teams/6")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 401);
    assert.match(response.headers["content-type"], /json/);
  });

  it("Should respond with 200 when getting my team", async (t) => {
    const response = await request(app)
      .get("/api/team/get-my-team/1")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 200);
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response._body.members.length, 4);
  });
});

const UserRole = {
  Student: "STUD",
  Instructor: "INST"
}

async function createUser(userRole) {
  if (userRole == undefined) {
    userRole = UserRole.Student;
  }
  const email = `test.${randomLetters()}@mail.com`;
  const password = "password";
  const user = {
    password,
    firstName: "test-user",
    lastName: "test-user",
    email,
    schoolID: userRole + randomNumber(4),
    role: userRole
  }
  await request(app)
    .post("/api/user/create")
    .set("Accept", "application/json")
    .send(user)
    .timeout(1000)
    .expect(200);
  return { email, password };
}

async function createCourse(loginCookie) {
  const course = {
    courseName: `TEST ${randomNumber(3)}`,
  };
  const response = await request(app)
    .post("/api/course/create")
    .set("Accept", "application/json")
    .send(course)
    .set("Cookie", loginCookie)
    .timeout(1000);
  assert.equal(response.status, 200);
  return response.body.courseID;
}

/**
 * @type {string[]}
 */
const testEmails = [];

suite("POST requests to create a team", async () => {

  before(async () => {
    const teamSize = 3;
    for (let index = 0; index < teamSize; index++) {
      const student = await createUser(UserRole.Student)
      testEmails.push(student.email);
    }
  });

  it("should respond with 200 when creating a team with no members", async (t) => {
    const teacher = await createUser(UserRole.Instructor);
    const loginCookie = await loginUser(teacher.email, teacher.password);
    const courseID = await createCourse(loginCookie);
    const team = {
      teamName: "test_team",
      courseID,
      members: [],
    }
    const response = await request(app)
      .post("/api/team/create")
      .set("Accept", "application/json")
      .set("Cookie", loginCookie)
      .send(team)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 200);
    assert.ok(typeof response.body.teamID === 'number');
  });

  it("should respond with 200 when creating a team with some members", async (t) => {
    const teacher = await createUser(UserRole.Instructor);
    const loginCookie = await loginUser(teacher.email, teacher.password);
    const courseID = await createCourse(loginCookie);
    const team = {
      teamName: "test_team",
      courseID,
      members: testEmails,
    }
    const response = await request(app)
      .post("/api/team/create")
      .set("Accept", "application/json")
      .set("Cookie", loginCookie)
      .send(team)
      .expect(200)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.ok(typeof response.body.teamID === 'number');
  });

  it("should respond with 401 when trying to create a team with no login", async () => {
    const team = {
      teamName: "test_team",
      courseID: 1,
      members: testEmails,
    }
    const response = await request(app)
      .post("/api/team/create")
      .set("Accept", "application/json")
      .send(team)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(401, response.status);
  });
});

suite("POST requests to delete teams", async () => {

  it("should respond with 200 when deleting a team", async () => {
    const teacher = await createUser(UserRole.Instructor);
    const loginCookie = await loginUser(teacher.email, teacher.password);
    const courseID = await createCourse(loginCookie);
    const team = {
      teamName: "test_team",
      courseID,
      members: testEmails,
    }

    // creating a team
    const response = await request(app)
      .post("/api/team/create")
      .set("Accept", "application/json")
      .set("Cookie", loginCookie)
      .send(team)
      .expect(200)
      .timeout(1000);

    const teamID = response.body.teamID;

    await request(app)
      .post("/api/team/delete")
      .set("Accept", "application/json")
      .set("Cookie", loginCookie)
      .send({ teamID })
      .expect(200);

    assert.match(response.headers["content-type"], /json/);
  });

  it("should respond with 401 when trying to delete a team without login", async () => {
    const response = await request(app)
      .post("/api/team/delete")
      .set("Accept", "application/json")
      .send({ teamID: 1 });
    assert.equal(401, response.status);
  })
});