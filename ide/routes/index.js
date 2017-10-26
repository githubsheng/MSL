const express = require('express');
const router = express.Router();
const path = require('path');
const {exec} = require('child_process');
const slash = require('slash');
const fs = require("fs");

const indexFilePath = path.resolve('public/html/index.html');
const jarPath = slash(path.resolve("compiler/MSL-1.0-SNAPSHOT-jar-with-dependencies.jar"));
const inputPath = slash(path.resolve("compiler/input/input.txt"));
const outputPath = slash(path.resolve("compiler/output"));
const commandsStrPath = slash(path.resolve("compiler/output/commandsStr.txt"));
const stringConstantsPath = slash(path.resolve("compiler/output/stringConstants.txt"));
const encoding = 'utf8';

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(indexFilePath);
});

router.post('/exec', function (req, res, next) {
    const src = req.body.data;

    fs.writeFile(inputPath, src, (error) => {

    });

    exec(`java -jar ${jarPath} ${inputPath} ${outputPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error.trim()}`);
            return;
        }
        const compileSuccessMessage = stdout.trim();
        const compileErrorMessage = stderr.trim();
        if(compileSuccessMessage === "successful") {
            //todo: read the two files and return them
            let commsStrs = null;
            let strsConsts = null;
            fs.readFile(commandsStrPath, encoding, (err, data) => {
                if (err) throw err;
                commsStrs = data;
                trySendCommsStrsAndStrsConsts(res, commsStrs, strsConsts);
            });
            fs.readFile(stringConstantsPath, encoding, (err, data) => {
                if (err) throw err;
                strsConsts = data;
                trySendCommsStrsAndStrsConsts(res, commsStrs, strsConsts);
            });
        } else {
            res.json({
                errMsg: compileErrorMessage
            });
        }

        function trySendCommsStrsAndStrsConsts(res, commsStrs, strsConsts) {
            if(commsStrs && strsConsts) {
                res.json({
                    commsStrs,
                    strsConsts
                });
            }
        }
    });
});

module.exports = router;
