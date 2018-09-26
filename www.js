#!/usr/bin/env node

const http = require('http'),
    path = require('path'),
    configPath = path.resolve(__dirname, './.config'),
    Config = require('./includes/config')(configPath);

if ( Config.error ) {
    return; // Don't run http server
}

console.log(Config);

http.createServer( (req, res ) => {
    // Watch for file changes and clear cached
    require('./includes/clear-cache');

    // Load application
    require('./includes/router');

}).listen(Config.Port);