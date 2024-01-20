const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const ensureAuthorization = (req) => {
    try{
        const { authorization: receivedJwt } = req.headers;

        let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
        return decodedJwt;
    } catch (err) {
        console.log(err.name);
        console.log(err.message);

        return err;
    }
}

module.exports = ensureAuthorization;