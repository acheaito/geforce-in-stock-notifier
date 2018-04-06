'use strict';

const fs = require('fs');
const util = require('util');
const config = require("../config").getConfiguration();
const quietPeriod = require('../quiet-period');
const emailer = require('../emailer');

module.exports = {
    checkStock: checkStock
};

async function checkStock() {
    console.log("NVIDIA Stock Checker");
    setUpLogging();
    const inQuietPeriod = quietPeriod.isInQuietPeriod(config.receiver.minutesBetweenSuccessEmails);
    checkStockInNvidiaStore(inQuietPeriod);
}

async function checkStockInNvidiaStore(inQuietPeriod) {
    const puppeteer = require('puppeteer');

    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        console.log(`Opening ${config.store.url}`);
        await page.goto(config.store.url);

        const content = await page.evaluate(() => {
            return document.documentElement.innerHTML;
        });

        fs.writeFileSync('page.html', content);

        const inStock = getStock(content);

        console.log(`Item ${config.store.itemName} is ${inStock ? '' : 'NOT'} in stock`);

        if (inStock && !inQuietPeriod) {
            console.log('Sending In Stock email');
            emailer.sendInStockEmail();
            quietPeriod.startQuietPeriod();
        } else if (!inStock && inQuietPeriod) {
            console.log('Sending Out Of Stock email');
            emailer.sendOutOfStockEmail();
            quietPeriod.endQuietPeriod();
        } else {
            console.log(`Email will not be sent. InStock=${inStock} && inQuietPeriod=${inQuietPeriod}`)
        }

        await browser.close();
    })();
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