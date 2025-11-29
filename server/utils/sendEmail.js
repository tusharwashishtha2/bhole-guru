const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    // For Gmail, you might need an App Password if 2FA is on.
    // Alternatively, use a service like SendGrid or Mailgun for production.
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // use STARTTLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,
        socketTimeout: 10000,
        family: 4 // Force IPv4
    });

    // Define email options
    const mailOptions = {
        from: `${process.env.FROM_NAME || 'Bhole Guru'} <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
