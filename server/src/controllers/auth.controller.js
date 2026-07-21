const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const OTPModel = require('../models/otp.model');
const { sendOTPEmail } = require('../services/email.service');

async function registerUser(req, res) {
    try {
        const {
            name,
            email,
            password,
        } = req.body;
        console.log("Saving OTP for:", email);
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(409).json({
                message: 'User already exists.'
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTPModel.findOneAndUpdate(
            { email },
            {
                email,
                otp,
                userData: {
                    name,
                    email,
                    password,
                },
                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
            },
            {
                upsert: true,
                returnDocument: 'after'
            }
        );

        await sendOTPEmail(email, otp);
        return res.status(200).json({
            message: 'OTP sent successfully.'
        });
    } catch (err) {
        console.error('REGISTER ERROR:', err);

        return res.status(500).json({
            message: err.message
        });
    }
}

async function verifyOTP(req, res) {
    try {
        const { email, otp } = req.body;
        const otpRecord = await OTPModel.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({
                message: 'OTP not found or expired.'
            });
        }

        if (otpRecord.expiresAt < new Date()) {
            await OTPModel.deleteOne({ email });

            return res.status(400).json({
                message: 'OTP has expired.'
            });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP.'
            });
        }

        const user = await userModel.create(otpRecord.userData);

        await OTPModel.deleteOne({ email });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });

    } catch (err) {
        console.error('VERIFY OTP ERROR:', err);
        return res.status(500).json({
            message: err.message
        });
    }
}

async function resendOTP(req, res) {
    try {
        const { email } = req.body;

        const otpRecord = await OTPModel.findOne({ email });

        if (!otpRecord) {
            return res.status(404).json({
                message: 'No pending registration found.'
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        otpRecord.otp = otp;
        otpRecord.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await otpRecord.save();

        await sendOTPEmail(email, otp);

        return res.status(200).json({
            message: 'OTP resent successfully.'
        });
    } catch (err) {
        console.error('RESEND OTP ERROR:', err);
        return res.status(500).json({
            message: err.message
        });
    }
}

async function loginUser(req, res) {
    try {
        
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'Invalid email or password.'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        console.error('LOGIN ERROR:', err);

        return res.status(500).json({
            message: err.message
        });
    }
}


async function logoutUser(req, res) {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });

        return res.status(200).json({
            message: 'Logged out successfully.'
        });
    } catch (err) {
        console.error('LOGOUT ERROR:', err);

        return res.status(500).json({
            message: err.message
        });
    }
}

const getCurrentUser = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
};
module.exports = {
    registerUser,
    verifyOTP,
    resendOTP,
    loginUser,
    logoutUser,
    getCurrentUser
};