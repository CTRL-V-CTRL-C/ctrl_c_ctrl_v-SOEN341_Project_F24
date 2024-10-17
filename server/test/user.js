import { suite, it, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../server.js'
import { db, pool } from '../database/db.js'
import { randomLetters, randomNumber } from './utils.js'

suite("POST requests to create a user", () => {

    // disconnect from the database after the tests
    after(async () => {
        // await db.end();
        // await pool.end();
    });

    it("should respond with 200 when creating a user with name and password", async (t) => {
        const user = {
            password: "password",
            firstName: "John",
            lastName: "Smith",
            email: `test.${randomLetters()}@mail.com`,
            schoolID: `INST${randomNumber(4)}`,
            role: "INST"
        }
        const response = await request(app)
            .post("/api/user/create")
            .set("Accept", "application/json")
            .send(user)
            .expect(200)
            .timeout(1000); // timesout after 1 second in case the app crashes

        assert.match(response.headers["content-type"], /json/);
    });
})