jest.mock('../config');
const config = require('config');
const nodemailer = require('nodemailer');

setUpConfigMock();
let emailer = null;

beforeAll(() => {
    setUpConfigMock();
});

beforeEach(() => {
    emailer = require('../emailer');
});

function setUpConfigMock() {
    let mockConfig = {
        sender: {address: "friendly_script@example.com", password: "T0PS3CR3T!"},
        receiver: {address: "eager_miner@example.com"},
        store: {itemName: "MockForce1", url: "http://example.com"}
    };
    config.getConfiguration.mockImplementation(() => mockConfig);
}

test('uses sender address from config file', () => {
    emailer.sendInStockEmail();
    expect(nodemailer.transporter.sendMail).toBeCalledWith(expect.objectContaining({"from": "friendly_script@example.com"}), expect.anything());
});

test('uses receiver address from config file', () => {
    emailer.sendInStockEmail();
    expect(nodemailer.transporter.sendMail).toBeCalledWith(expect.objectContaining({"to": "eager_miner@example.com"}), expect.anything());
});

test('in-stock email title contains NOW IN STOCK', () => {
    emailer.sendInStockEmail();
    expect(nodemailer.transporter.sendMail).toBeCalledWith(expect.objectContaining({"subject": "IN STOCK NOW! MockForce1"}), expect.anything());
});

test('out-of-stock email title contains no longer in Stock', () => {
    emailer.sendOutOfStockEmail();
    expect(nodemailer.transporter.sendMail).toBeCalledWith(expect.objectContaining({"subject": "No longer in Stock... MockForce1"}), expect.anything());
});

test('gracefully handles errors', () => {
    nodemailer.__mockErrorCondition("Something went horribly wrong");
    emailer.sendInStockEmail();
});