const express = require('express');
const router = express.Router();
const path = require('path');
const indexFilePath = path.resolve('public/html/index.html');
const {execSync} = require('child_process');
const slash = require('slash');
const {rootPath} = require('../util');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(indexFilePath);
});

router.post('/exec', function (req, res, next) {
    console.log(req.body.data);
    const jarPath = slash(path.resolve(rootPath, "MSL-1.0-SNAPSHOT-jar-with-dependencies.jar"));
    const inputPath = slash(path.resolve(rootPath, "compiler/input/input.txt"));
    const outputPath = slash(path.resolve(rootPath, "compiler/output"));
    console.log(`java -jar ${jarPath} ${inputPath} ${outputPath}`);
    const child = execSync(`java -jar ${jarPath} ${inputPath} ${outputPath}`);
    console.log(`child process exited with code ${child.status} and signal ${child.signal}`);

    res.send("1");
});

module.exports = router;
