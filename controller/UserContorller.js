const conn = require('../mariadb');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {StatusCodes} = require('http-status-codes');

dotenv.config();

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

const login = (req, res)=>(req, res) => {
    const { email, password } = req.body;

    let sql = `select * from users where email = ?`;
    conn.query(sql, email,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const loginUser = results[0];
            if (loginUser && loginUser.password == password) {
                const token = jwt.sign({
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
            var loginUser = results[0];
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
    let sql = `UPDATE users SET password=? WHERE email=?`;
    let values = [password, email];
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

module.exports = {
    join,
    login,
    passwordResetRequest,
    passwordReset
};