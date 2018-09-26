const express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    dbxHttp = express();

dbxHttp.use(cookieParser(), bodyParser.json(), (req, res) => {
    res.end('You are here');
});

module.exports = dbxHttp;