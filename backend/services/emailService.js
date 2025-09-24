const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    // Check if SMTP credentials are configured
    this.isConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
    
    if (this.isConfigured) {
      const smtpPort = Number(process.env.SMTP_PORT || 587);
      const smtpSecureEnv = (process.env.SMTP_SECURE || '').toLowerCase();
      const smtpSecure = smtpSecureEnv === 'true' || smtpPort === 465;

      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: smtpPort,
        secure: smtpSecure, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      console.warn('⚠️  Email service not configured. SMTP credentials missing.');
      console.warn('   Add SMTP_USER and SMTP_PASS to your .env file to enable email notifications.');
    }

    // Load email templates
    this.templates = {
      uploadSuccess: this.loadTemplate('uploadSuccess'),
      verificationSuccess: this.loadTemplate('verificationSuccess'),
      verificationFailure: this.loadTemplate('verificationFailure')
    };
  }

  loadTemplate(templateName) {
    try {
      const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      return handlebars.compile(templateSource);
    } catch (error) {
      console.error(`Error loading template ${templateName}:`, error);
      return null;
    }
  }

  async sendEmail(to, subject, html) {
    if (!this.isConfigured) {
      console.log('📧 Email not sent - SMTP not configured. Would send to:', to);
      console.log('   Subject:', subject);
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const mailOptions = {
        from: `"DocChain" <${process.env.SMTP_USER}>`,
        to: to,
        subject: subject,
        html: html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendUploadSuccessEmail(userEmail, fileName, fileHash, ipfsUrl) {
    if (!this.templates.uploadSuccess) {
      console.error('Upload success template not found');
      return { success: false, error: 'Template not found' };
    }

    const templateData = {
      userName: userEmail.split('@')[0],
      fileName: fileName,
      fileHash: fileHash,
      ipfsUrl: ipfsUrl,
      currentDate: new Date().toLocaleDateString(),
      currentTime: new Date().toLocaleTimeString()
    };

    const html = this.templates.uploadSuccess(templateData);
    const subject = `Document Upload Successful - DocChain`;

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendVerificationSuccessEmail(userEmail, fileName, fileHash, ipfsUrl) {
    if (!this.templates.verificationSuccess) {
      console.error('Verification success template not found');
      return { success: false, error: 'Template not found' };
    }

    const templateData = {
      userName: userEmail.split('@')[0],
      fileName: fileName,
      fileHash: fileHash,
      ipfsUrl: ipfsUrl,
      currentDate: new Date().toLocaleDateString(),
      currentTime: new Date().toLocaleTimeString()
    };

    const html = this.templates.verificationSuccess(templateData);
    const subject = `Document Verification Successful - DocChain`;

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendVerificationFailureEmail(userEmail, fileName, fileHash) {
    if (!this.templates.verificationFailure) {
      console.error('Verification failure template not found');
      return { success: false, error: 'Template not found' };
    }

    const templateData = {
      userName: userEmail.split('@')[0],
      fileName: fileName,
      fileHash: fileHash,
      currentDate: new Date().toLocaleDateString(),
      currentTime: new Date().toLocaleTimeString()
    };

    const html = this.templates.verificationFailure(templateData);
    const subject = `Document Verification Failed - DocChain`;

    return await this.sendEmail(userEmail, subject, html);
  }

  async testConnection() {
    if (!this.isConfigured) {
      return { 
        success: false, 
        error: 'Email service not configured. Add SMTP_USER and SMTP_PASS to .env file.',
        configured: false
      };
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return { success: true, configured: true };
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return { success: false, error: error.message, configured: true };
    }
  }
}

module.exports = EmailService;
