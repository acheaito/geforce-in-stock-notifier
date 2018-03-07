'use strict';

const controller = require('./quiet-period-controller.js');

module.exports = {
    checkQuietPeriod: controller.checkQuietPeriod,
    setQuietPeriod: controller.setQuietPeriod,
    resetQuietPeriod: controller.resetQuietPeriod
};