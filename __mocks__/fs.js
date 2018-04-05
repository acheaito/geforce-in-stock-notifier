'use strict';

const fs = jest.genMockFromModule('fs');

let mockFiles = Object.create(null);

function __setMockFiles(newMockFiles) {
    for (var i = 0; i < newMockFiles.length; i++) {
        const file = newMockFiles[i];
        console.log("Mocking " + file);
        mockFiles[file] = {name: file, stats: {mtime: Date.now()}};
    }
}

function existsSync(file) {
    console.log(mockFiles);
    return mockFiles[file] ? true : false;
}

function statSync(file) {
    console.log("Returning stats " + mockFiles[file].stats);
    return mockFiles[file].stats;
}

function closeSync(file) {
    return null;
}

function openSync(file, mode) {
    console.log("OPEN SYNC ON " + file);
    __setMockFiles(new Array(file));
}

function unlinkSync(file) {
    delete mockFiles[file];
}

fs.__setMockFiles = __setMockFiles;
fs.existsSync = existsSync;
fs.statSync = statSync;
fs.closeSync = closeSync;
fs.openSync = openSync;
fs.unlinkSync = unlinkSync;

module.exports = fs;