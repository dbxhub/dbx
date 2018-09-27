const express    = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    dbxHttp      = express();

require('./functions');
require('./l8n');
require('./db');

dbxHttp.use(cookieParser(), bodyParser.json(), require('./db'));

module.exports = dbxHttp;