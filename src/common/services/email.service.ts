import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: {
    sendMail: (arg0: {
      from: string;
      to: string;
      subject: string;
      html: string;
    }) => any;
  };

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: parseInt(process.env.EMAIL_PORT ?? '2525'),
      auth: {
        user: process.env.EMAIL_USER || 'your_mailtrap_username',
        pass: process.env.EMAIL_PASS || 'your_mailtrap_password',
      },
    });
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM || 'reconfortdanny@gmail.com',
      to: email,
      subject: 'Password Reset Code',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Use the following code to reset your password:</p>
        <h2>${code}</h2>
        <p>This code will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
      `,
    });
  }

  async sendAdminAccountCredentials(email: string, name: string, password: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM || 'reconfortdanny@gmail.com',
      to: email,
      subject: 'Your Admin Account Credentials',
      html: `
        <h1>Welcome to the Admin Team!</h1>
        <p>Hello ${name},</p>
        <p>An admin account has been created for you. Here are your login credentials:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p><strong>Important:</strong> For security reasons, please change your password after your first login.</p>
        <p>If you have any questions, please contact the system administrator.</p>
      `,
    });
  }
}