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
    }

    connect( cb ) {
        this.conn.getConnection(cb);
    }

    query( sql, format, callback ) {
        format = format || [];

        this.conn.query( sql, format, (err, results) => {
            if ( err ) {
                return callback(false);
            }

            return callback(results);
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

        if ( whereClause ) {
            let whereFields = this.prepareColumns(_.keys(whereColumns)),
                whereValues = this.escape(_.values(whereColumns));

            sql += " WHERE " + whereFields.join(', ');
            values = values.concat(whereValues);
        }

        return this.db.query(sql, values, (err, results) => {
            if ( err ) {
                return callback(false, this);
            }

            return callback(results);
        });
    }

    delete(table, whereClause, callback) {

    }
}

module.exports = () => {
    return new DBX();
};