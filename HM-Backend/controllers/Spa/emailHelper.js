const nodemailer = require('nodemailer');
const SpaEmail = require('../../model/schema/spaEmail');

const sendEmail = async ({ to, subject, html, pdfBuffer, filename = 'invoice.pdf', createdBy = null }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.verify();

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
    attachments: pdfBuffer ? [{
      filename,
      content: pdfBuffer,
    }] : [],
  };

  const info = await transporter.sendMail(mailOptions);

  const emailRecord = new SpaEmail({
    subject,
    message: html,
    recipientMail: [to],
    emailId: info.messageId,
  });

  if (createdBy) {
    emailRecord.createBy = createdBy;
  }

  await emailRecord.save();
};
module.exports = { sendEmail };
