'use strict';

const fs = require('fs');
const util = require('util');
const emailMarkerFile = 'lastEmailTimestamp.marker';
const config = require("properties").parse(fs.readFileSync("src/config/config.ini", "utf-8"), {sections: true});

module.exports = {
    checkQuietPeriod: checkQuietPeriod,
    setQuietPeriod: setQuietPeriod,
    resetQuietPeriod: resetQuietPeriod
};

function checkQuietPeriod() {
    if (fs.existsSync(emailMarkerFile)) {
        let stats = fs.statSync(emailMarkerFile);
        const now = new Date();
        const lastEmail = new Date(util.inspect(stats.mtime));
        const diff = now.getTime() - lastEmail.getTime();
        const diffMinutes = diff / (1000 * 60);
        if (diffMinutes < config.receiver.minutesBetweenSuccessEmails) {
            return true;
        }
    }
    return false;
}

function setQuietPeriod() {
    fs.closeSync(fs.openSync(emailMarkerFile, 'w'));   //touch email timestamp file
}

function resetQuietPeriod() {
    fs.unlinkSync(emailMarkerFile);
}