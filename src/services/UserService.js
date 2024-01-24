const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/UserModel');

dotenv.config();

class UserService {
    static async join(email, password) {
        const user = new User(null, email, password);
        await user.save();
        return user;
    }

    static async login(email, password) {
        const user = await User.findByEmail(email);
        if (user && user.verifyPassword(password)) {
            const token = jwt.sign({
                id : user.id,
                email : user.email
            }, process.env.PRIVATE_KEY, {
                expiresIn : '30m',
                issuer : "me"
            });
            return token;
        }
        return null;
    }

    static async passwordResetRequest(email) {
        const user = await User.findByEmail(email);
        return user ? user.email : null;
    }

    static async passwordReset(email, password) {
        const user = await User.findByEmail(email);
        if (user) {
            user.password = password;
            await user.updatePassword();
            return user;
        }
        return null;
    }
}

module.exports = UserService;
