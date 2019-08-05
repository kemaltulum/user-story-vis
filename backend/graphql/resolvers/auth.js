const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

module.exports = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('User exists already.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });

            const result = await user.save();

            return { ...result._doc, password: null, _id: result.id };
        } catch (err) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.SECRET_KEY,
            {
                expiresIn: '365d'
            }
        );
        return { userId: user.id, token: token, tokenExpiration: 1 };
    },
    verifyToken: ({token}) => {
        return jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err && err.name === 'TokenExpiredError'){
                return { expired: true };
            }
            return { expired: false };
        });
    }
};