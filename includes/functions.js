global.getSiteOption = (home, callback) => {
    const sql = 'SELECT * FROM ?? WHERE `home` = ?',
        format = [dbx.option, home];

    return dbx.query( sql, format, callback );
};