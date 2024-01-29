const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const dotenv = require('dotenv');
dotenv.config();

const ensureAuthorization = (req) => {
    try {
        const { authorization: receivedJwt } = req.headers;

        if (receivedJwt) {
            let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
            return decodedJwt;
        }

        throw new ReferenceError("jwt must be provided");
    } catch (err) {
        console.log(err.name);
        console.log(err.message);

        return err;
    }
}

const handleAuthError = (res, err) => {
    if (err instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션 만료. 다시 로그인하세요."
        });
    }
    if (err instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "잘못된 토큰."
        });
    }
    if (err instanceof ReferenceError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "jwt must be provided."
        });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        "message": "서버 내부 오류가 발생했습니다."
    });
}

module.exports = {
    ensureAuthorization,
    handleAuthError
};
