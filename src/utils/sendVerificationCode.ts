import nodemailer from 'nodemailer';
import { smtpHost, smtpPort } from '../secret';
import { verificationEmailTemplate } from '../emailTemplate/verificationEmailTemplate';


// to create transport
const transporter = nodemailer.createTransport({

    host: smtpHost,
    port: parseInt(smtpPort || '587', 10),
    secure: false, // false for TLS
    //service: 'gmail',  // Use your email provider's SMTP service (for example, Gmail)
    auth: {
        user: process.env.EMAIL,   // Your email (set this in your environment variables)
        pass: process.env.EMAIL_PASSWORD // Your email password (set this in your environment variables)
    }
});

export const sendVerificationCodeEmail = async (name: string, email: string, verificationCode: string) => {
    try {
        // template for verification code
        const emailHTML = verificationEmailTemplate(name, verificationCode);

        console.log("Email Template", emailHTML);


        // sending email
        await transporter.sendMail({
            from: process.env.EMAIL, // Sender's email address
            to: email, // Recipient's email address
            subject: 'SaveJobs Verification Code',
            html: emailHTML, // The HTML content of your email (rendered from your template)
        });

        console.log("email sent successfully to ", email);

        return {
            status: 200,
            success: true,
            message: "Verification email sent successfully"
        };

    } catch (error) {
        console.error("Email sending Error", error);
        return {
            status: 500,
            success: false,
            message: "Failed to send verification email"
        };
    }
}
