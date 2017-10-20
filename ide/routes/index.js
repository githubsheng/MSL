const express = require('express');
const router = express.Router();
const path = require('path');
const indexFilePath = path.resolve('public/html/index.html');
const {exec} = require('child_process');
const slash = require('slash');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(indexFilePath);
});

router.post('/exec', function (req, res, next) {
    //todo: read the req.body. the req.body is a json object, the object has a field called data.
    console.log(req.body.data);
    const jarPath = slash(path.resolve("compiler/MSL-1.0-SNAPSHOT-jar-with-dependencies.jar"));
    const inputPath = slash(path.resolve("compiler/input/input.txt"));
    const outputPath = slash(path.resolve("compiler/output"));
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
