import { suite, it, after, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { app } from '../server.js';
import { db, pool } from '../database/db.js';

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
suite("GET teams as an instructor", () => {
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
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 200);
    assert.equal(response._body.length, 3);
  });

  it("Should respond with 401 when getting teams in a course that they don't teach", async (t) => {
    const response = await request(app)
      .get("/api/team/get-teams/2")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 401);
  });

  it("Should respond with 401 when getting my team", async (t) => {
    const response = await request(app)
      .get("/api/team/get-my-team/1")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 401);
  });

});

suite("GET my team and other teams as a student", () => {
  let cookies;

  // disconnect from the database after the tests
  after(async () => {
    await logoutUser(cookies);
    await db.end();
    await pool.end();
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
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 200);
    assert.equal(response._body.length, 2);
  });

  it("Should respond with 401 when getting teams in a course they are not part of", async (t) => {
    const response = await request(app)
      .get("/api/team/get-teams/6")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 401);
  });

  it("Should respond with 200 when getting my team", async (t) => {
    const response = await request(app)
      .get("/api/team/get-my-team/1")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 200);
    assert.equal(response._body.members.length, 4);
  });

});