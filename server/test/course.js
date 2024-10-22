import { suite, it, after, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { app } from '../server.js';
import { db } from '../database/db.js';

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
suite("GET courses and students as an instructor", async () => {
  let cookies;

  after(async () => {
    await logoutUser(cookies);
  });

  before(async () => {
    cookies = await loginUser("joeparker13@gmail.com", "password");
  });

  it("Should respond with 200 when getting courses", async (t) => {
    const response = await request(app)
      .get("/api/course/get-courses")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 200);
    assert.equal(response._body.length, 2);
  });

  it("Should respond with 200 when getting students in a course that they teach", async (t) => {
    const response = await request(app)
      .get("/api/course/get-students/1")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 200);
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response._body.length, 12);
  });

  it("Should respond with 401 when getting students in a course that they don't teach", async (t) => {
    const response = await request(app)
      .get("/api/course/get-students/2")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 401);
    assert.match(response.headers["content-type"], /json/);
  });


});

suite("GET courses and students as a student", async () => {
  let cookies;

  after(async () => {
    await logoutUser(cookies);
  });

  before(async () => {
    cookies = await loginUser("joeparker1@gmail.com", "password");
  });

  it("Should respond with 200 when getting courses", async (t) => {
    const response = await request(app)
      .get("/api/course/get-courses")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.match(response.headers["content-type"], /json/);
    assert.equal(response.status, 200);
    assert.equal(response._body.length, 5);
  });

  it("Should respond with 401 when trying to get students in a course", async (t) => {
    const response = await request(app)
      .get("/api/course/get-students/1")
      .set("Accept", "application/json")
      .set("Cookie", cookies)
      .timeout(1000); // timesout after 1 second in case the app crashes
    assert.equal(response.status, 401);
    assert.match(response.headers["content-type"], /json/);
  });
});