const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log(`@!@!@!@! token`,token);
    if (!token) {
        return res.status(401).json({
            message: 'Not authorized, no token'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({
                message: 'Not authorized, user not found'
            });
        }

        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({
            message: 'Not authorized, token failed'
        });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            message: 'Not authorized as admin'
        });
    }
};

module.exports = { protect, admin };