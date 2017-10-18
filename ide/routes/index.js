const express = require('express');
const router = express.Router();
const path = require('path');
const indexFilePath = path.resolve('public/html/index.html');
const {exec} = require('child_process');
const slash = require('slash');
const {rootPath} = require('../util');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(indexFilePath);
});

router.post('/exec', function (req, res, next) {
    console.log(req.body.data);
    const jarPath = slash(path.resolve(rootPath, "compiler/MSL-1.0-SNAPSHOT-jar-with-dependencies.jar"));
    const inputPath = slash(path.resolve(rootPath, "compiler/input/input.txt"));
    const outputPath = slash(path.resolve(rootPath, "compiler/output"));
    console.log(1);
    exec(`java -jar ${jarPath} ${inputPath} ${outputPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error.trim()}`);
            return;
        }
        const compileSuccessMessage = stdout.trim();
        const compileErrorMessage = stderr.trim();
        console.log("ss " + compileSuccessMessage);
        console.log("er " + compileErrorMessage);
        console.log("--");
        //todo: do something here.
        res.send("1");
    });
});

module.exports = router;
