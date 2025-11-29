const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    // For Gmail, you might need an App Password if 2FA is on.
    // Alternatively, use a service like SendGrid or Mailgun for production.
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your SMTP host
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
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
