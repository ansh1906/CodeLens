const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    userData: {
        type: Object,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const OTPModel = mongoose.model('OTP', otpSchema);

module.exports = OTPModel;