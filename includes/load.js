const express    = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    dbxHttp      = express();

require('./functions');
require('./l8n');
//require('./db');

const dbxDb = (req, res, next) => {
    if ( ! Config.Driver ) {
        res.end('System error!');
    }

    const driver = Config.Driver.toLowerCase();

    let DBX;

    try {
        DBX = require('./driver/' + driver);
    } catch(e) {
        res.end('System error!');
    }

    global.dbx = DBX();
    global.dbxHome = req.hostname;

    // Check database connection
    dbx.connect()
        .then(() => {
            // Get site options
            return getSiteOption(dbxHome)
                .then((options) => {
                    res.json(options);
                })
                .catch(() => {
                    res.end('Install page');
                });
        })
        .catch(() => {
            res.end('Error establishing database connection!');
        });
};

dbxHttp.use(cookieParser(), bodyParser.json(), dbxDb);

module.exports = dbxHttp;
