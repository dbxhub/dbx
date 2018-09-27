

module.exports = (req, res, next) => {

    if ( ! Config.Driver ) {
        // Show 500 error
        res.end('Configuration error!');
    }

    const driver = Config.Driver.toLowerCase();

    let DBX;

    try {
        DBX = require('./driver/' + driver);
    } catch(e) {
        // Show 500 error
        res.end('Configuration error!');
    }

    global.dbx = DBX();

    dbx.connect()
        .then(() => {
            // Get site options here
            return 'GET OPTIONS';
        })
        .then((o) => {
            res.end(o);
        })
        .catch(() => {
            res.end('Error establishing database connection!');
        });
};