import { suite, it, after, before } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../server.js'
import { db, pool } from '../database/db.js'

const UserRole = {
    Student: "STUD",
    Instructor: "INST"
}

function randomLetters(maxLength) {
    const r = (Math.random() + 1).toString(36).substring(2)
    if (maxLength) {
        return r.substring(r.length - maxLength)
    }
    return r
}

async function createUser(userRole) {
    const email = `test.${randomLetters()}@mail.com`;
    const password = "1234";
    const user = {
        username: email,
        password: "some password",
        firstName: "test_user",
        lastName: "test_user",
        email,
        schoolID: `${randomLetters(8)}`,
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

async function loginUser(email, password) {
    // TODO: login the user
}

async function createCourse(instructorEmail, instructorPassword) {
    await loginUser(instructorEmail, instructorPassword);
    const course = {
        courseName: `test_course_${randomLetters()}`,
    };
    const response = await request(app)
        .post("/api/courses/create")
        .set("Accept", "application/json")
        .send(course)
        .timeout(1000)
        .expect(200);
}

const testEmails = [];

suite("POST requests to create a team", () => {
    // disconnect from the database after the tests
    after(async () => {
        await db.end();
        await pool.end();
    });

    before(async () => {
        const teamSize = 3;
        for (let index = 0; index < teamSize; index++) {
            testEmails.push(await createUser());
        }
    })

    it("should respond with 200 when creating a team with no members", async (t) => {
        const team = {
            teamName: "test_team",
            courseId: ""
            members: [],
        }
        const response = await request(app)
            .post("/api/teams/create")
            .set("Accept", "application/json")
            .send(team)
            .timeout(1000); // timesout after 1 second in case the app crashes
        assert.match(response.headers["content-type"], /json/);
        assert.equal(response.status, 200);
    });

    it("should respond with 200 when creating a team with some members", { skip: true }, async (t) => {
        const team = {
            teamName: "test_team",
            members: testEmails,
        }
        const response = await request(app)
            .post("/api/teams/create")
            .set("Accept", "application/json")
            .send(team)
            .expect(200)
            .timeout(1000); // timesout after 1 second in case the app crashes
        assert.match(response.headers["content-type"], /json/);
    });
})