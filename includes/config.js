/*
 * Parses a string or buffer into an object
 * @param {(string|Buffer)} src - source to be parsed
 * @returns {Object} keys and values from src
 *
 * @borrowed from `dotenv`
*/
function parse (src) {
    const obj = {};

    // convert Buffers before splitting into lines and processing
    src.toString().split('\n').forEach(function (line) {
        // matching "KEY' and 'VAL' in 'KEY=VAL'
        const keyValueArr = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        // matched?
        if (keyValueArr != null) {
            let key = keyValueArr[1];

            // default undefined or missing values to empty string
            let value = keyValueArr[2] || '';

            // expand newlines in quoted values
            const len = value ? value.length : 0;
            if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
                value = value.replace(/\\n/gm, '\n');
            }

            // remove any surrounding quotes and extra spaces
            value = value.replace(/(^['"]|['"]$)/g, '').trim();

            // Remove `DBX` prefix
            key = key.replace(/DBX_/, '');

            // Normalize port
            if ('Port' === key) {
                let port = parseInt(value, 10);

                if ( port > 0 ) {
                    value = port;
                }
            }

            obj[key] = value;
        }
    });

    return obj;
}

const fs = require('fs');

module.exports = function dbxConfig( filePath ) {
    try {
        let fileHandle = fs.readFileSync(filePath, 'utf-8');

        if ( ! fileHandle ) {
            return false;
        }

        let _env = parse(fileHandle);

        return _env;
    } catch(e) {
        return {error: true};
    }
};