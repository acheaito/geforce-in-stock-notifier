'use strict';

const config = require("../config").getConfiguration();

module.exports = {
    sendInStockEmail: sendInStockEmail,
    sendOutOfStockEmail: sendOutOfStockEmail
};

function sendInStockEmail() {
    const mailOptions = {
        from: config.sender.address,
        to: config.receiver.address,
        subject: `IN STOCK NOW! ${config.store.itemName}`,
        text: `Store URL: ${config.store.url} \n\nLooks like the ${config.store.itemName} is now in stock\n\nYour friendly stock checker script`
    };

    sendEmail(mailOptions);
}


function sendOutOfStockEmail() {
    const mailOptions = {
        from: config.sender.address,
        to: config.receiver.address,
        subject: `No longer in Stock... ${config.store.itemName}`,
        text: `Store URL: ${config.store.url} \n\nLooks like the ${config.store.itemName} is no longer in stock\n\nYour friendly stock checker script`
    };

    sendEmail(mailOptions);
}

function sendEmail(mailOptions) {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.sender.address,
            pass: config.sender.password
        }
    });

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
