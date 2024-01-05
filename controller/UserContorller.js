const conn = require('../mariadb');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {StatusCodes} = require('http-status-codes');

dotenv.config();
router.use(express.json());

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
        function (err, results) {
            var loginUser = results[0];
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

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
    res.json('비밀번호 초기화 요청');
};

const passwordReset = (req, res) => {
    res.json('비밀번호 초기화');
};

module.exports = {
    join,
    login,
    passwordResetRequest,
    passwordReset
};