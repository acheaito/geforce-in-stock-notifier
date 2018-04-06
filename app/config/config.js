const fs = require('fs');
const path= require('path');

const config = require("properties").parse(fs.readFileSync(path.join(__dirname,'config.ini'), "utf-8"), {sections: true});

module.exports = {
    getConfiguration: getConfiguration
};

function getConfiguration() {
    return config;
}