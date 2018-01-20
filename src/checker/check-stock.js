'use strict';

const fs = require('fs');
const util = require('util');
const emailMarkerFile = 'lastEmailTimestamp.marker';
const config = require("properties").parse(fs.readFileSync("src/config/config.ini", "utf-8"), {sections: true});

module.exports = {
    checkStock: checkStock
};

async function checkStock() {
    console.log("NVIDIA Stock Checker");
    setUpLogging();
    const shouldCheck = shouldCheckStock();
    if (!shouldCheck) {
        console.log(`Last successful hit was less than ${config.receiver.minutesBetweenSuccessEmails} minutes ago. Will not check for now.`);
        return;
    }

    console.log(`Opening ${config.store.url}`);
    const phantom = require('phantom');
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on('onResourceRequested', function (requestData) {
        console.info('Requesting', requestData.url);
    });

    const status = await page.open(config.store.url);
    const content = await page.property('content');

    console.log("Page load finished");
    const inStock = getStock(content);
    if (inStock) {
        console.log(`Item ${config.store.itemName} in stock!!! Sending email`);
        sendEmail();
    } else {
        console.log(`Item ${config.store.itemName} not in stock`);
    }

    await instance.exit();
}

function setUpLogging() {
    const logFile = fs.createWriteStream('run.log', {flags: 'w'});
    const logStdout = process.stdout;

    console.log = function () {
        const message = new Date() + " - " + util.format.apply(null, arguments) + '\n';
        logFile.write(message);
        logStdout.write(message);
    };
    console.error = console.log;
}

function getStock(content) {
    const cheerio = require('cheerio');
    const $ = cheerio.load(content);
    const productDiv = $("div[data-digital-river-id='" + config.store.itemId + "']");
    const outOfStock = productDiv.find("a[data-href*='#notify-me-" + config.store.itemId + "']");
    const inStock = productDiv.find("div:contains('ADD TO CART') ");
    console.log("OutOfStock=" + outOfStock);
    console.log("InStock=" + inStock);
    return inStock.length > 0;
}

function shouldCheckStock() {
    if (fs.existsSync(emailMarkerFile)) {
        let stats = fs.statSync(emailMarkerFile);
        const now = new Date();
        const lastEmail = new Date(util.inspect(stats.mtime));
        const diff = now.getTime() - lastEmail.getTime();
        const diffMinutes = diff / (1000 * 60);
        if (diffMinutes < config.receiver.minutesBetweenSuccessEmails) {
            return false;
        }
    }
    return true;
}

function sendEmail() {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.sender.address,
            pass: config.sender.password
        }
    });

    const mailOptions = {
        from: config.sender.address,
        to: config.receiver.address,
        subject: `IN STOCK NOW! ${config.store.itemName}`,
        text: `Store URL: ${config.store.url} \n\nLooks like the ${config.store.itemName} is now in stock\n\nYour friendly stock checker script`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            fs.closeSync(fs.openSync(emailMarkerFile, 'w'));   //touch email timestamp file
            console.log('Email sent: ' + info.response);
        }
    });
}
