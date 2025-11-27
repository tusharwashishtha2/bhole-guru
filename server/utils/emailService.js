const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter
    // For production, use SendGrid, Mailgun, or Gmail SMTP
    // For now, we will log to console if no credentials are provided

    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.log('----------------------------------------------------');
        console.log('EMAIL SERVICE (Simulation):');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log('----------------------------------------------------');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your SMTP host
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // 2. Define email options
    const mailOptions = {
        from: 'Bhole Guru <noreply@bholeguru.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html // Optional HTML content
    };

    // 3. Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
