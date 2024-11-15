import request from 'supertest';
import assert from 'node:assert';
import express from 'express'
import { randomLetters, uniqueRandomNumber } from './utils.js';


async function loginUser(app, email, password) {
    const response = await request(app)
        .post("/api/login")
        .set("Accept", "application/json")
        .send({ email, password });
    assert.equal(response.status, 200, response.body.msg);
    return response.headers['set-cookie'];
}

async function logoutUser(app, cookies) {
    const response = await request(app)
        .post("/api/logout")
        .set("Accept", "application/json")
        .set("Cookie", cookies)
        .timeout(1000);
    assert.equal(response.status, 200, response.body.msg);
    return response.headers['set-cookie'];
}

async function createCourseAPI(app, loginCookie) {
    const course = {
        courseName: `TEST ${uniqueRandomNumber(3)}`,
    };
    const response = await request(app)
        .post("/api/course/create")
        .set("Accept", "application/json")
        .send(course)
        .set("Cookie", loginCookie)
        .timeout(1000);
    assert.equal(response.status, 200, response.body.msg);

    return response.body.courseID;
}

const UserRole = {
    Student: "STUD",
    Instructor: "INST"
}

/**
 * creates a user uding the api
 * @param {express.Application} app
 * @param {"STUD" | "INST"} userRole 
 * @returns an object containing the user info
 */
async function createUserAPI(app, userRole) {
    if (userRole == undefined) {
        userRole = UserRole.Student;
    }
    const email = `test.${randomLetters()}@mail.com`;
    const password = "password";
    const schoolID = userRole + uniqueRandomNumber(4);
    const firstName = "John";
    const lastName = "Smith";
    const user = {
        password,
        firstName,
        lastName,
        email,
        schoolID,
        role: userRole
    }
    const response = await request(app)
        .post("/api/user/create")
        .set("Accept", "application/json")
        .send(user)
        .timeout(1000);
    assert.equal(response.status, 200, response.body.msg);
    return user;
}

export { createUserAPI, createCourseAPI, loginUser, logoutUser, UserRole }
