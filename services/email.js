const dotenv = require('dotenv');

dotenv.config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.error('Error configuring email transporter:', error);
    } else {
        console.log('Email transporter is ready to send messages');
    }
});

const sendEmail = async (to, subject, text, html = '') => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to} with subject "${subject}"`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw error;
    }
};

module.exports = sendEmail;
