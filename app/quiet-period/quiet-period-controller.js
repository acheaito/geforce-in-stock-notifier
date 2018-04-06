'use strict';

const fs = require('fs');
const util = require('util');
const emailMarkerFile = 'lastEmailTimestamp.marker';
const config = require("../config").getConfiguration();

module.exports = {
    isInQuietPeriod: isInQuietPeriod,
    startQuietPeriod: startQuietPeriod,
    endQuietPeriod: endQuietPeriod
};

function isInQuietPeriod(quietPeriodMinutes) {
    if (fs.existsSync(emailMarkerFile)) {
        let stats = fs.statSync(emailMarkerFile);
        const now = new Date();
        const lastEmail = new Date(stats.mtime);
        const diff = now.getTime() - lastEmail.getTime();
        const diffMinutes = diff / (1000 * 60);
        if (diffMinutes < quietPeriodMinutes) {
            return true;
        }
    }
    return false;
}

function startQuietPeriod() {
    fs.closeSync(fs.openSync(emailMarkerFile, 'w'));   //touch marker file
}

function endQuietPeriod() {
    if (fs.existsSync(emailMarkerFile)) {
        fs.unlinkSync(emailMarkerFile);
    }
}