module.exports = (req, res, next) => {

    if ( ! Config.Driver ) {
        // Show 500 error
        res.end('500 ERROR');
    }

    const driver = Config.Driver.toLowerCase();

    let DBX;

    try {
        DBX = require('./driver/' + driver);
    } catch(e) {
        // Show 500 error
        res.end('500 ERROR 2');
    }

    global.dbx = DBX();

    dbx.connect((err) => {
        if ( err ) {
            res.end('Error establishing database connection!');
        }

        next();
    });
};