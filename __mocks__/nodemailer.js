'use strict';

const nodemailer = jest.genMockFromModule('nodemailer');

let transporter = new Object(null);
let simulateError = false;
let msg = null;

function createTransport(mailConfig) {
    return transporter;
}

transporter.sendMail = jest.fn((mailOptions, callback) => {
    if (simulateError) {
        simulateError = false;
        callback(msg, {response: "Fake Error"})
    } else {
        callback(null, {response: "Fake Success"});
    }
});

function __mockErrorCondition(msg_) {
    msg = msg_;
    simulateError = true;
}

nodemailer.createTransport = createTransport;
nodemailer.transporter = transporter;
nodemailer.__mockErrorCondition = __mockErrorCondition;

module.exports = nodemailer;