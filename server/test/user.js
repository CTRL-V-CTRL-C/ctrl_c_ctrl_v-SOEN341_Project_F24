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
        const user = {
            username: "XxJohnyxX",
            password_hash: "73f07a34e3dad5929ed6fac8725824caa6bce13667d9380ffe24784d7c9d3311",
            salt: "QTHGVmyPK7PC4FK2",
            firstName: "John",
            lastName: "Smith",
            email: "john.smith@mail.com",
            schoolID: "12345678",
            role: "INST"
        }
        const response = await request(app)
            .post("/user/create")
            .set("Accept", "application/json")
            .send(user);
        assert.equal(response.status, 200);
        assert.match(response.headers["content-type"], /json/);
    });
})