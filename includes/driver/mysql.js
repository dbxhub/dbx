const mysql = require('mysql');

class DBX {
    constructor() {
        const host = Config.MySQL_Host,
            dbName = Config.MySQL_DB_Name,
            dbUser = Config.MySQL_DB_User,
            dbPass = Config.MySQL_DB_Pass;

        this.conn = mysql.createPool({
            connectionLimit: 10,
            host: host,
            user: dbUser,
            password: dbPass,
            database: dbName,
            supportBigNumbers: true
        });

        this.setTables();
    }

    setTables() {
        this.prefix = Config.Prefix || 'dbx_';

        const tables = ['option', 'user'];

        tables.map( (table) => {
            this[table] = this.prefix + table;
        });
    }

    connect() {
        let conn = this.conn;

        return new Promise( (resolve, reject) => {
            conn.getConnection( (err, con) => {
                if ( err ) {
                    reject(err);
                }

                resolve(con);
            })
        });
    }

    query( sql, format, callback ) {
        format = format || [];

        if ( callback ) {
            return this.conn.query( sql, format, callback );
        }

        return new Promise( (res, rej) => {
            this.conn.query(sql, format, (err, result) => {
                if ( err ) {
                    rej(err);
                }

                res(result);
            });
        });
    }

    escape( values ) {
        _.each( values, ( v, k ) => {
            values[k] = mysql.escape(v);
        });

        return values;
    }

    prepareColumns( columns ) {
        let _columns = [];

        _.each( columns, ( k ) => {
            _columns.push(k + ' = ? ');
        });

        return _columns;
    }

    insert( table, columns, callback ) {
        let fields = _.keys( columns ),
            values = this.escape( _.values( columns ) );

        let sql = "INSERT INTO " + table +
            " (" + fields.join(',') + ") VALUES ('" + values.join("','") + "')";

        this.conn.query( sql, (err, results) => {
            if ( err ) {
                return callback(false, this);
            }

            return callback(results, this);
        });
    }

    update(table, columns, whereColumns, callback) {
        let fields = this.prepareColumns(_.keys(columns)),
            values = this.escape(_.values(columns));

        let sql = "UPDATE " + table + " SET " + fields.join(', ');

        if ( whereColumns ) {
            let whereFields = this.prepareColumns(_.keys(whereColumns)),
                whereValues = this.escape(_.values(whereColumns));

            sql += " WHERE " + whereFields.join(', ');
            values = values.concat(whereValues);
        }

        return this.conn.query(sql, values, (err, results) => {
            if ( err ) {
                return callback(false, this);
            }

            return callback(results);
        });
    }

    delete(table, whereClause, callback) {}
}

module.exports = () => {
    return new DBX();
};