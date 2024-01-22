const conn = require('../database/mariadb');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');
const {StatusCodes} = require('http-status-codes');

dotenv.config();

const join = (req, res) => {
    const { email, password } = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    let sql = `INSERT INTO users (email, password, salt) VALUES(?, ?, ?)`;
    let values = [email, hashPassword, salt];
    conn.query(sql, values,
        function (err, results) {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results.affectedRows) return res.status(StatusCodes.CREATED).json(results);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    );
}

const login = (req, res) => {
    const { email, password } = req.body;

    let sql = `select * from users where email = ?`;
    conn.query(sql, email,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const loginUser = results[0];

            const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512').toString('base64');

            if (loginUser && loginUser.password == hashPassword) {
                const token = jwt.sign({
                    id : loginUser.id,
                    email : loginUser.email
                }, process.env.PRIVATE_KEY, {
                    expiresIn : '30m',
                    issuer : "me"
                });

                res.cookie("token", token, {
                    httpOnly : true
                });

                res.status(StatusCodes.OK).json(results);
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: `이메일 또는 비밀번호가 틀렸습니다.`
                });
            }
        }
    );
};

const passwordResetRequest =  (req, res)=>{
    const { email } = req.body;

    let sql = `select * from users where email = ?`;
    conn.query(sql, email,
        function (err, results) {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const user = results[0];
            if (user) {
                return res.status(StatusCodes.OK).json({
                    email : email
                });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    );
};

const passwordReset = (req, res) => {
    const {email, password} = req.body;

    sql = `UPDATE users SET password=?, salt=? WHERE email=?`;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    let values = [hashPassword, salt, email];
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results.affectedRows == 0) return res.status(StatusCodes.BAD_REQUEST).end();
            else return res.status(StatusCodes.OK).json(results);
        }
    );
};

module.exports = Object.freeze({
    join,
    login,
    passwordResetRequest,
    passwordReset
});
