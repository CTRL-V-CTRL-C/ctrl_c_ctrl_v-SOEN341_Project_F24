import { suite, it, after, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { app } from '../server.js';
import { createUserAPI, createCourseAPI, loginUser, logoutUser, UserRole } from './apiUtils.js';
import { generateEmail, generateSchoolID, uniqueRandomNumber } from './utils.js';
import { db } from '../database/db.js';
//Tests based on populate scripts
suite("GET teams as an instructor", async () => {
  let cookies;


  // disconnect from the database after the tests
  after(async () => {
    await logoutUser(app, cookies);
  });

  before(async () => {
    cookies = await loginUser(app, "joeparker13@gmail.com", "password");
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
    await logoutUser(app, cookies);
  });

  before(async () => {
    cookies = await loginUser(app, "joeparker1@gmail.com", "password");
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



suite("POST requests to create a team", async () => {
  /**
   * @type {import('../database/user.js').User[]}
   */
  const testMembers = [];
  let teacher;
  let loginCookie;
  let courseID;
  before(async () => {
    teacher = await createUserAPI(app, UserRole.Instructor);
    loginCookie = await loginUser(app, teacher.email, teacher.password);
    courseID = await createCourseAPI(app, loginCookie);
    const teamSize = 3;
    for (let index = 0; index < teamSize; index++) {
      const student = await createUserAPI(app, UserRole.Student);
      testMembers.push(student);
    }
  });

  after(async () => {
    await db.query(`DELETE FROM users WHERE school_id = '${teacher.schoolID}'`);
    testMembers.forEach(async (member) => {
      await db.query(`DELETE FROM users WHERE school_id = '${member.schoolID}'`);
    });
  })

  it("should respond with 200 when creating a team with no members", async (t) => {

    const team = {
      teamName: "test_team_" + uniqueRandomNumber(6),
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

    const team = {
      teamName: "test_team_" + uniqueRandomNumber(6),
      courseID,
      members: testMembers,
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
      teamName: "test_team_" + uniqueRandomNumber(6),
      courseID: 1,
      members: testMembers,
    }
    const response = await request(app)
      .post("/api/team/create")
      .set("Accept", "application/json")
      .send(team)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(401, response.status);
  });

  it("should create a user when that user doesn't exist in a team", async () => {
    const newMember = {
      firstName: "John",
      lastName: "Sith",
      email: generateEmail(),
      schoolID: generateSchoolID("STUD"),
      role: "STUD"
    };
    // adding this member to the test members so it gets delete after
    testMembers.push(newMember);
    const team = {
      teamName: "test_team_" + uniqueRandomNumber(7),
      courseID: 1,
      members: [newMember],
    }
    const response = await request(app)
      .post("/api/team/create")
      .set("Accept", "application/json")
      .set("Cookie", loginCookie)
      .send(team)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(200, response.status);
  });
});

suite("POST requests to delete teams", async () => {
  let teacher;
  let loginCookie;
  let courseID;
  const testMembers = [];

  before(async () => {
    teacher = await createUserAPI(app, UserRole.Instructor);
    loginCookie = await loginUser(app, teacher.email, teacher.password);
    courseID = await createCourseAPI(app, loginCookie);
    const teamSize = 3;
    for (let index = 0; index < teamSize; index++) {
      const student = await createUserAPI(app, UserRole.Student);
      testMembers.push(student);
    }
  });

  after(async () => {
    await db.query(`DELETE FROM users WHERE school_id = '${teacher.schoolID}'`);
    testMembers.forEach(async (member) => {
      await db.query(`DELETE FROM users WHERE school_id = '${member.schoolID}'`);
    });
  });

  it("should respond with 200 when deleting a team", async () => {
    const team = {
      teamName: "test_team",
      courseID,
      members: testMembers,
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
