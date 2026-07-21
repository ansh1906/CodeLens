const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendOTPEmail(email, otp) {

    console.log('Sending OTP to:', email);
    await transporter.sendMail({
        from: `"CodeLens" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your CodeLens OTP',
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Verify your CodeLens account</h2>
                <p>Your OTP is:</p>

                <h1 style="letter-spacing: 8px;">
                    ${otp}
                </h1>

                <p>This OTP expires in 10 minutes.</p>
            </div>
        `
    });
}

module.exports = {
    sendOTPEmail
};