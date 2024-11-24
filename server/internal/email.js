import fs from 'node:fs';
import path from 'node:path';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

import log from '../logger.js'

async function createTransporter() {
    const clientSecret = process.env.EMAIL_CLIENT_SECRET;
    const clientId = process.env.EMAIL_CLIENT_ID;
    const refreshToken = process.env.EMAIL_REFRESH_TOKEN;

    const Oauth2 = google.auth.OAuth2;
    const oauth2Client = new Oauth2({
        clientId, clientSecret, redirectUri: "https://developers.google.com/oauthplayground"
    });

    oauth2Client.setCredentials({
        refresh_token: refreshToken
    });
    const accessToken = await oauth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAUTH2",
            user: "peer.check.service@gmail.com",
            accessToken,
            clientId,
            clientSecret,
            refreshToken
        },
    });
    return transport;
}
const htmlTemplatePath = path.join(import.meta.dirname, '..', 'assets', 'email-template', 'email.html');
const htmlTemplate = fs.readFileSync(htmlTemplatePath)
    .toString();

/**
 * creates an html string that has the email and password of the user
 * NOTE: since we use CID, this html contains images that need to be embeded in the email
 * @param {string} email the email of the user
 * @param {string} password the password of the user
 */
function createTempPasswordHTML(email, password) {
    return htmlTemplate
        .replace(/\{\{email\}\}/g, email)
        .replace(/\{\{password\}\}/g, password);
}

const txtTemplatePath = path.join(import.meta.dirname, '..', 'assets', 'email-template', 'email.txt');
const txtTemplate = fs.readFileSync(txtTemplatePath)
    .toString();

/**
 * creates a txt string that has the email and password of the user
 * @param {string} email the email of the user
 * @param {string} password the password of the user
 */
function createTempPasswordTXT(email, password) {
    return txtTemplate
        .replace(/\{\{email\}\}/g, email)
        .replace(/\{\{password\}\}/g, password);
}

/**
 * sends an email to a user informing them of their password
 * @param {string} mailTo the user to send the email to
 * @param {string} password the passowrd of the user
 */
function sendTempPasswordEmail(mailTo, password) {
    const html = createTempPasswordHTML(mailTo, password);
    const txt = createTempPasswordTXT(mailTo, password);

    transport.sendMail({
        from: process.env.EMAIL_CLIENT_EMAIL,
        to: mailTo,
        subject: 'Your PeerCheck account has been created',
        html,
        text: txt,
        attachments: [
            {
                filename: 'image-1.png',
                cid: 'image-1',
                path: path.join(import.meta.dirname, '..', 'assets', 'email-template', 'images', 'image-1.png')
            },
            {
                filename: 'image-2.png',
                cid: 'image-2',
                path: path.join(import.meta.dirname, '..', 'assets', 'email-template', 'images', 'image-2.png')
            }
        ]
    }, (error, info) => {
        if (error) {
            log.error("There was an error while sending the email");
            log.error(error);
        } else {
            log.info("An email has been sent");
        }
    });
}

log.info("Creating transport");
const transport = await createTransporter();
log.info("Verifying transport");
await new Promise((resolve, reject) => {
    transport.verify((error) => {
        if (error) {
            log.error("There was an error while verify the SMTP transport");
            log.error(error);
            reject(error);
        } else {
            resolve();
        }
    });
});

const htmlNotificationTemplatePath = path.join(import.meta.dirname, '..', 'assets', 'email-template', 'emailNotification.html');
const htmlNotificationTemplate = fs.readFileSync(htmlNotificationTemplatePath).toString();
const txtNotificationTemplatePath = path.join(import.meta.dirname, '..', 'assets', 'email-template', 'emailNotification.txt');
const txtNotificationTemplate = fs.readFileSync(txtNotificationTemplatePath).toString();

/**
 * sends an email to a user informing them that evaluations have been released
 * @param {string} mailTo the user to send the email to
 * @param {string} courseName the name of the course that released the evaluations
 */
function sendReleaseNotificationEmail(mailTo, courseName) {
    const html = htmlNotificationTemplate.replace(/\{\{courseName\}\}/g, courseName);
    const txt = txtNotificationTemplate.replace(/\{\{courseName\}\}/g, courseName);

    transport.sendMail({
        from: process.env.EMAIL_CLIENT_EMAIL,
        to: mailTo,
        subject: 'Feedback for one of your courses has been released on PeerCheck',
        html,
        text: txt,
        attachments: [
            {
                filename: 'image-1.png',
                cid: 'image-1',
                path: path.join(import.meta.dirname, '..', 'assets', 'email-template', 'images', 'image-1.png')
            },
            {
                filename: 'image-2.png',
                cid: 'image-2',
                path: path.join(import.meta.dirname, '..', 'assets', 'email-template', 'images', 'image-2.png')
            }
        ]
    }, (error, info) => {
        if (error) {
            log.error("There was an error while sending the email");
            log.error(error);
        } else {
            log.info("An email has been sent");
        }
    });
}

export { sendTempPasswordEmail, sendReleaseNotificationEmail }