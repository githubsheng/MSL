const express = require('express');
const router = express.Router();
const path = require('path');
const {exec} = require('child_process');
const slash = require('slash');
const fs = require("fs");

const inputFolderPath = slash(path.resolve("compiler/input"));
const outputFolderPath = slash(path.resolve("compiler/output"));
const jarPath = slash(path.resolve("compiler/MSL-1.0-SNAPSHOT-jar-with-dependencies.jar"));


const inputFilePath = slash(path.resolve("compiler/input/input.txt"));
const commandsStrPath = slash(path.resolve("compiler/output/commandsStr.txt"));
const stringConstantsPath = slash(path.resolve("compiler/output/stringConstants.txt"));

const encoding = 'utf8';

if(!fs.existsSync(inputFolderPath)) fs.mkdirSync(inputFolderPath);
if(!fs.existsSync(outputFolderPath)) fs.mkdirSync(outputFolderPath);

function commonFailureCallback(res, compileErrorMessage){
    /*
     the compile error message contains information of following format (example)

     line 3:16 mismatched input '\n' expecting {'(', ScriptModeRowStart, ScriptModeColStart, '!', DecimalLiteral, Seconds, Minutes, Hours, ClockUnit, BooleanLiteral, StringLiteral, 'clock', Identifier}
     line 5:13 mismatched input '\n' expecting {'(', ScriptModeRowStart, ScriptModeColStart, '!', DecimalLiteral, Seconds, Minutes, Hours, ClockUnit, BooleanLiteral, StringLiteral, 'clock', Identifier}
     Exception in thread "main" java.lang.RuntimeException: unsupported expression
     at DLS.ParseTreeVisitor.visitExpression(ParseTreeVisitor.java:495)
     at DLS.ParseTreeVisitor.visitVariableStatement(ParseTreeVisitor.java:446)
     at DLS.ParseTreeVisitor.tryGetSingleStatementNode(ParseTreeVisitor.java:414)
     at DLS.ParseTreeVisitor.getStatementNodes(ParseTreeVisitor.java:397)
     at java.util.stream.ReferencePipeline$3$1.accept(Unknown Source)
     at java.util.ArrayList$ArrayListSpliterator.forEachRemaining(Unknown Source)
     at java.util.stream.AbstractPipeline.copyInto(Unknown Source)
     at java.util.stream.AbstractPipeline.wrapAndCopyInto(Unknown Source)
     at java.util.stream.ReduceOps$ReduceOp.evaluateSequential(Unknown Source)
     at java.util.stream.AbstractPipeline.evaluate(Unknown Source)
     at java.util.stream.ReferencePipeline.collect(Unknown Source)
     at DLS.ParseTreeVisitor.getScriptStatements(ParseTreeVisitor.java:236)
     at DLS.ParseTreeVisitor.visitPage(ParseTreeVisitor.java:247)
     at DLS.ParseTreeVisitor.getPageNodeOrPageGroupNode(ParseTreeVisitor.java:97)
     at java.util.stream.ReferencePipeline$3$1.accept(Unknown Source)
     at java.util.ArrayList$ArrayListSpliterator.forEachRemaining(Unknown Source)
     at java.util.stream.AbstractPipeline.copyInto(Unknown Source)
     at java.util.stream.AbstractPipeline.wrapAndCopyInto(Unknown Source)
     at java.util.stream.ReduceOps$ReduceOp.evaluateSequential(Unknown Source)
     at java.util.stream.AbstractPipeline.evaluate(Unknown Source)
     at java.util.stream.ReferencePipeline.collect(Unknown Source)
     at DLS.ParseTreeVisitor.visitFile(ParseTreeVisitor.java:93)
     at DLS.Main.main(Main.java:46)

     as you can see we only need to show to user which line and which column has what error, but we do not need to show the java runtime exceptions
     */
    const withoutJavaRuntimeExceptions = compileErrorMessage.split('\n')
        .filter(line => line.startsWith("line"));
    res.json({
        errMsg: withoutJavaRuntimeExceptions
    });
}

function compileCallbackGenenertor(successCallback, failCallback){
    return function (req, res, next) {
        const {data: src, commandIndexOffset = 0, strConstsIndexOffset = 0} = req.body;
        fs.writeFile(inputFilePath, src, (error) => {
            if(error) {
                console.log(error);
                return;
            }
            exec(`java -jar ${jarPath} ${inputFilePath} ${outputFolderPath} ${commandIndexOffset} ${strConstsIndexOffset}`, (error, stdout, stderr) => {
                const compileSuccessMessage = stdout.trim();
                const compileErrorMessage = stderr.trim();
                compileSuccessMessage === "successful" ? successCallback(res) : failCallback(res, compileErrorMessage);
            });
        });

    }
}

const tryCompileAndReportErrorMessage = (function(){
    function successCallback(res) {
        res.json({});
    }
    return compileCallbackGenenertor(successCallback, commonFailureCallback);
})();

const tryCompileAndReturnCommsAndStrConsts = (function(){
    function successCallback(res){
        //todo: read the two files and return them
        let commsStrs = null;
        let strsConsts = null;
        let isCommsStrsFileRead = false;
        let isStrsConstsFileRead = false;
        fs.readFile(commandsStrPath, encoding, (err, data) => {
            if (err) throw err;
            isCommsStrsFileRead = true;
            commsStrs = data;
            trySendCommsStrsAndStrsConsts(res, commsStrs, strsConsts);
        });
        fs.readFile(stringConstantsPath, encoding, (err, data) => {
            if (err) throw err;
            isStrsConstsFileRead = true;
            strsConsts = data;
            trySendCommsStrsAndStrsConsts(res, commsStrs, strsConsts);
        });
        function trySendCommsStrsAndStrsConsts(res, commsStrs, strsConsts) {
            if(isCommsStrsFileRead && isStrsConstsFileRead) {
                res.json({
                    commsStrs,
                    strsConsts
                });
            }
        }
    }
    return compileCallbackGenenertor(successCallback, commonFailureCallback);
})();

/**
 * tries to compiles, if successful, returns an empty json object
 * if not successful, returns a json object with a single field `errMsg`.
 */
router.post('/compile', tryCompileAndReportErrorMessage);

/**
 * tries to compiles, if successful, returns a json object with two fields `commsStrs` and `strsConsts`
 * if not successful, returns a json object with a single field `errMsg`.
 */
router.post('/exec', tryCompileAndReturnCommsAndStrConsts);

module.exports = router;
