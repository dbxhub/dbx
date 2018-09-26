#!/usr/bin/env node

const http = require('http'),
    path = require('path'),
    configPath = path.resolve(__dirname, './.config'),
    Config = require('./includes/config')(configPath);

if ( Config.error ) {
    return; // Don't run http server
}

global.Config = Config;
global.ABSPATH = path.resolve(__dirname, './');
global._ = require('underscore');

http.createServer( (req, res ) => {
    // Watch for file changes and clear cached
    require('./includes/clear-cache');

    // Load application
    require('./includes/router')(req, res);

}).listen(Config.Port);