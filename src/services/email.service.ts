import nodemailer, { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

interface InvitationEmailData {
  recipientName: string;
  inviterName: string;
  familyName: string;
  role: string;
  acceptLink: string;
}

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        cc: options.cc,
        bcc: options.bcc,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }

  // Send Family Invitation Email
  async sendFamilyInvitation(data: InvitationEmailData): Promise<boolean> {
    const htmlTemplate = this.createInvitationTemplate(data);
    const textTemplate = this.createInvitationTextTemplate(data);

    return this.sendEmail({
      to: data.recipientName,
      subject: `Family Invitation: Join ${data.familyName}`,
      html: htmlTemplate,
      text: textTemplate,
    });
  }

  // HTML Email Template
  private createInvitationTemplate(data: InvitationEmailData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Family Invitation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Family Invitation</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333333; margin-top: 0;">Hi ${data.recipientName || 'there'}! 👋</h2>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                <strong>${data.inviterName}</strong> has invited you to join the <strong>${data.familyName}</strong> family group with the role of <strong>${data.role}</strong>.
              </p>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                By accepting this invitation, you'll be able to collaborate and share assets with other family members.
              </p>
              
              <!-- Accept Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${data.acceptLink}" 
                       style="display: inline-block; 
                              padding: 15px 40px; 
                              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                              color: #ffffff; 
                              text-decoration: none; 
                              border-radius: 5px; 
                              font-size: 16px; 
                              font-weight: bold;
                              box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #999999; font-size: 14px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #667eea; font-size: 14px; word-break: break-all;">
                ${data.acceptLink}
              </p>
              
              <p style="color: #999999; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                This invitation will expire in 7 days.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="color: #999999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Your App Name. All rights reserved.
              </p>
              <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">
                If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  // Plain Text Email Template (fallback)
  private createInvitationTextTemplate(data: InvitationEmailData): string {
    return `
Hi ${data.recipientName || 'there'}!

${data.inviterName} has invited you to join the ${data.familyName} family group with the role of ${data.role}.

By accepting this invitation, you'll be able to collaborate and share assets with other family members.

Accept this invitation by clicking the link below:
${data.acceptLink}

This invitation will expire in 7 days.

If you didn't expect this invitation, you can safely ignore this email.

© ${new Date().getFullYear()} Your App Name. All rights reserved.
    `;
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection verified');
      return true;
    } catch (error) {
      console.error('❌ SMTP connection failed:', error);
      return false;
    }
  }
}

export default new EmailService();
