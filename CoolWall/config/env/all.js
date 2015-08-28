var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,
    db: process.env.MONGOHQ_URL,
    //dbhost : "10.30.229.30",
    dbhost : "10.97.16.166",
    dbport : 6379
}