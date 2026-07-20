const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: 'No token found.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('AUTH MIDDLEWARE ERROR:', err);

        return res.status(401).json({
            message: 'Invalid token.'
        });
    }
};

module.exports = authMiddleware;