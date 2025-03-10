const pool = require('../.db/database');

module.exports = {
    create: (data, callback) => {
        pool.query(
        `insert into users(name, email, password)
            values(?,?,?)`,
        [
            data.name,
            data.email,
            data.password
        ],
        (err, result, fields) => {
            if (err) {
                return callback(err);
            }
            return callback(null, results);
        }
        )
    }
}
