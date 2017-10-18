const express = require('express');
const router = express.Router();
const path = require('path');
const indexFilePath = path.resolve('public/html/index.html');
const {execSync} = require('child_process');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(indexFilePath);
});

router.post('/exec', function (req, res, next) {
    console.log(req.body.data);
    const child = execSync('java -jar D:/personal/MSL/ide/MSL-1.0-SNAPSHOT-jar-with-dependencies.jar D:/personal/MSL/ide/MSLtest/input.txt D:/personal/MSL/ide/MSLtest');
    console.log(`child process exited with code ${child.status} and signal ${child.signal}`);

    res.send("1");
});

module.exports = router;
