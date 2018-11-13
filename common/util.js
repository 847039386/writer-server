const compressing = require('compressing');
const mongoutils = require('@seiren/mongoutils');
const Config = require('../config');
const path = require('path');


const compressFolder = (filePath,outPath) => {
    return new Promise((resolve ,reject) => {
        compressing.zip.compressDir(filePath, outPath)
        .then(() => {
            resolve(outPath);
        })
        .catch(err => {
            reject(err);
        });
    })
}

const mongoDump = (options) => {
    options = options || {};
    const outDirPath = options.path || "./data/database-dump";
    const url = `mongodb://${Config.db.host || 'localhost'}:${Config.db.port || 27017}/${Config.db.database || 'drama'}`;
    let info = mongoutils.parseMongoUrl(url);
    let command = mongoutils.createDumpCommand(info, outDirPath);



    const filePath = path.resolve(__dirname,`.${outDirPath}/${Config.db.database || 'drama'}`);
    const outPath = path.resolve(__dirname,`.${outDirPath}/${Config.db.database || 'drama'}.zip`);
    return new Promise((resolve ,reject) => {
        mongoutils.executeCommand(command)
        .then(function(result) {
            resolve({ filePath ,outPath });
        })
        .catch(function(error) {
            reject(error);
        })
    })
}


exports.mongoDump = mongoDump;
exports.compressFolder = compressFolder;