const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const ensureAuthorization = (req) => {
    try{
        const { authorization: receivedJwt } = req.headers;

        if(receivedJwt) {
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

module.exports = ensureAuthorization;
