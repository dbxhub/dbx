/**
 Clear cached files whenever a file change occur.
 **/
const path = require('path'),
    fs = require('fs');

const clearCache = (filename) => {

    Object.keys(require.cache).map((id) => {
        if ( filename === id ) {
            delete require.cache[id];
        }
    });

};

// Clear lib
const libPath = path.resolve(__dirname, './../includes');

fs.watch(libPath, (err, filename) => {
    if ( err ) {
        return;
    }

    filename = path.resolve( libPath, filename );
    clearCache(filename);
});

fs.watch(ABSPATH, (err, filename) => {
    if ( err ) {
        return;
    }

    filename = path.resolve( ABSPATH, filename );
    clearCache(filename);
});
