import test, { suite, it } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../server.js'


suite("POST requests to create a user", () => {
    it("should respond with 200 when creating a user with name and password", async (t) => {
        const response = await request(app)
            .post("/user")
            .set("Accept", "application/json")
            .send({ username: 'john', password: 'THIS IS A HASH' })
        assert.equal(response.status, 200)
        assert.match(response.headers["content-type"], /json/)
    })
})