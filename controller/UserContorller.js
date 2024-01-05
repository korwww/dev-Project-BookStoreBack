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

const login = (req, res)=>{
    res.json('로그인');
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