const conn = require('../mariadb');

const join = (req, res) => {
    const { email, password } = req.body;

    let sql = `INSERT INTO users (email, password) VALUES(?, ?)`;
    let values = [email, password];
    console.log(`INSERT INTO users (email, password) VALUES(${email}, ${password})`);
    conn.query(sql, values,
        function (err, results) {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(201).json(results);
        }
    );
}

module.exports = join;