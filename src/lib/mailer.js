import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER, // your email
    pass: process.env.SMTP_PASS, // your password/app-password
  },
});

export async function sendMail(to, subject, html) {
  return transporter.sendMail({
    from: `"CGB Support" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
