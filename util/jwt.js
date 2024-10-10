const jwt = require('jsonwebtoken');

const generateToken = async userId => {
    const token = await jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '60d'
    });
    return token;
};

module.exports = { generateToken };
