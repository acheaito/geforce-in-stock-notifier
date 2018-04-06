'use strict';

const controller = require('./email-controller.js');

module.exports = {
    sendInStockEmail: controller.sendInStockEmail,
    sendOutOfStockEmail: controller.sendOutOfStockEmail
};