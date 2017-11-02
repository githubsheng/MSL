const express = require('express');
const router = express.Router();
const path = require('path');
const slash = require('slash');
const fs = require("fs");

const indexFilePath = path.resolve('public/html/index.html');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(indexFilePath);
});

module.exports = router;
