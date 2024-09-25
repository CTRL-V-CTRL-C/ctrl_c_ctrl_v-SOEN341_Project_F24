import { suite, it, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../server.js'
import { db } from '../database/db.js'

suite("POST requests to create a user", () => {

    // disconnect from the database after the tests
    after(async () => {
        await db.end();
    });

    it("should respond with 200 when creating a user with name and password", async (t) => {
        const response = await request(app)
            .post("/user/create")
            .set("Accept", "application/json")
            .send({ username: 'john', password: 'THIS IS A HASH' });
        assert.equal(response.status, 200);
        assert.match(response.headers["content-type"], /json/);
    });
})