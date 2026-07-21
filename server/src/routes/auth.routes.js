const userModel = require('../models/user.model');
const Router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

Router.post('/register', authController.registerUser);
Router.post('/verify-otp', authController.verifyOTP);
Router.post('/resend-otp', authController.resendOTP);
Router.post('/login', authController.loginUser);
Router.post('/logout', authController.logoutUser);
Router.get('/me', authMiddleware, authController.getCurrentUser);
// Router.put('/profile', authMiddleware, authController.updateProfile);
module.exports = Router;