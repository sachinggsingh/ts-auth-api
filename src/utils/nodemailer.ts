import nodemailer from "nodemailer";
import { logger } from "./logger";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify email configuration
transporter.verify((error: any, success: any) => {
    if (error) {
        logger.error('Email configuration error', {
            error: error.message,
            stack: error.stack
        });
    } else {
        logger.info('Email server is ready to send messages');
    }
});

export const sendLoginNotification = async (userEmail: string) => {
    const mailOptions = {
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'New Login Alert',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Login Alert</h2>
                <p>We detected a new login to your account.</p>
                <p><strong>Login Details:</strong></p>
                <ul>
                    <li>Time: ${new Date().toLocaleString()}</li>
                    <li>Email: ${userEmail}</li>
                </ul>
                <p>If this was you, you can ignore this email. If you didn't log in, please secure your account immediately.</p>
                <p>Best regards,<br>Your App Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info('Login notification email sent successfully', { userEmail });
    } catch (error) {
        logger.error('Error sending login notification email', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace available',
            userEmail,
        });
        throw error;
    }
};
