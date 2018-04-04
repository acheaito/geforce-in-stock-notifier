'use strict';

const controller = require('./quiet-period-controller');

module.exports = {
    isInQuietPeriod: controller.isInQuietPeriod,
    startQuietPeriod: controller.startQuietPeriod,
    endQuietPeriod: controller.endQuietPeriod
};