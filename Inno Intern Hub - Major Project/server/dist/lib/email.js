"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCertificateEmail = exports.sendPasswordResetEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendVerificationEmail = async (email, token) => {
    const verifyUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Verify your InnoInternHUB account",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #6366f1); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 InnoInternHUB</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email</h2>
            <p>Thanks for signing up! Please verify your email address to complete your registration.</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" class="button">Verify Email Address</a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              This link will expire in 24 hours. If you didn't create an account, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>© 2026 InnoInternHUB. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };
    // Only send in production, log in development
    if (process.env.NODE_ENV === "production") {
        await transporter.sendMail(mailOptions);
    }
    else {
        console.log("📧 Verification email would be sent to:", email);
        console.log("🔗 Verify URL:", verifyUrl);
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.APP_URL}/auth/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Reset your InnoInternHUB password",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #6366f1); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password. Click the button below to create a new password.</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>© 2026 InnoInternHUB. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };
    if (process.env.NODE_ENV === "production") {
        await transporter.sendMail(mailOptions);
    }
    else {
        console.log("📧 Password reset email would be sent to:", email);
        console.log("🔗 Reset URL:", resetUrl);
    }
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const sendCertificateEmail = async (email, studentName, projectTitle, certificateUrl) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `🎉 Your InnoInternHUB Certificate is Ready!`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Congratulations!</h1>
          </div>
          <div class="content">
            <h2>Your Certificate is Ready</h2>
            <p>Hi ${studentName},</p>
            <p>Congratulations on completing <strong>"${projectTitle}"</strong>! Your verified internship certificate is now ready for download.</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${certificateUrl}" class="button">Download Certificate</a>
            </p>
            <p>You can also share this certificate on LinkedIn and other platforms to showcase your achievement.</p>
          </div>
          <div class="footer">
            <p>© 2026 InnoInternHUB. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };
    if (process.env.NODE_ENV === "production") {
        await transporter.sendMail(mailOptions);
    }
    else {
        console.log("📧 Certificate email would be sent to:", email);
    }
};
exports.sendCertificateEmail = sendCertificateEmail;
//# sourceMappingURL=email.js.map