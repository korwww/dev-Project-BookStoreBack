const { StatusCodes } = require('http-status-codes');
const UserService = require('../services/UserService');

const userController = {
    join: async (req, res) => {
        try {
            const user = await UserService.join(req.body.email, req.body.password);

            if (user) return res.status(StatusCodes.CREATED).json({
                email: user.email,
                message: "회원가입 완료"
            });
            return res.status(StatusCodes.BAD_REQUEST).end();
        } catch (err) {
            console.log(err);

            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    },
    login: async (req, res) => {
        try {
            const token = await UserService.login(req.body.email, req.body.password);

            if (token) {
                res.cookie("token", token, { httpOnly: true });

                return res.status(StatusCodes.OK).json({ token });
            }
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: `이메일 또는 비밀번호가 틀렸습니다.`
            });

        } catch (err) {
            console.log(err);

            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    },
    passwordResetRequest: async (req, res) => {
        try {
            const email = await UserService.passwordResetRequest(req.body.email);

            if (email) return res.status(StatusCodes.OK).json({ email: email });
            return res.status(StatusCodes.UNAUTHORIZED).end();
        } catch (err) {
            console.log(err);

            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    },
    passwordReset: async (req, res) => {
        try {
            const user = await UserService.passwordReset(req.body.email, req.body.password);

            if (user) return res.status(StatusCodes.OK).json(user);
            return res.status(StatusCodes.BAD_REQUEST).end();
        } catch (err) {
            console.log(err);

            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    }
}

module.exports = Object.freeze(userController);
