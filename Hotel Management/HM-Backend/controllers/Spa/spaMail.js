// controllers/emailController.js
const nodemailer = require('nodemailer');
const SpaEmail = require('../../model/schema/spaEmail');

// For Gmail, you'll need to use these settings
const emailController = {
    /**
     * Send a simple email with fixed sender, subject and message
     */
    sendSimpleEmail: async (req, res) => {


        console.log('thi is for send mail')
        try {
            const { to, message, subject, name } = req.body;

            if (!to || !message) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required parameters: recipient (to) and message'
                });
            }

            // For Gmail, use these specific settings
            const transportConfig = {
                service: 'gmail',  // Use Gmail service preset
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: process.env.GMAIL_USER || 'safwsnhosaun@gmail.com', // Your Gmail address
                    pass: process.env.GMAIL_APP_PASSWORD // Use app password, not your regular password
                }
            };

            console.log('SMTP Config:', {
                host: transportConfig.host,
                port: transportConfig.port,
                secure: transportConfig.secure,
                user: transportConfig.auth.user
                // Don't log the password for security reasons
            });

            // Create transporter with config
            const transporter = nodemailer.createTransport(transportConfig);

            // Verify connection configuration
            await transporter.verify();
            console.log('SMTP connection verified successfully');

            // Create HTML content with centered layout and larger text

            // Set up email options
            const mailOptions = {
                from: 'amannafiz00@gmail.com', // Use the authenticated email
                to,
                subject,
                html: message, // HTML version of the email
            };

            // Send email
            const info = await transporter.sendMail(mailOptions);
            // console.log('Email sent:', info.messageId);

            try {
                // Create email record in database
                const emailData = {
                    subject,
                    message,
                    recipientMail: [to],
                    emailId: info.messageId,
                };

                // If user info is not available, handle it gracefully
                if (req.user?.contactId) {
                    emailData.createBy = req.user.contactId;
                }

                // Save email to database
                const newEmail = new SpaEmail(emailData);
                await newEmail.save();

                return res.status(200).json({
                    success: true,
                    message: 'Email sent successfully',
                    data: {
                        emailId: info.messageId,
                        emailRecord: newEmail._id
                    }
                });
            } catch (dbError) {
                // If database error occurs but email was sent
                console.error('Error saving email record:', dbError);
                return res.status(200).json({
                    success: true,
                    message: 'Email sent successfully, but failed to save record',
                    data: {
                        emailId: info.messageId,
                        error: dbError.message
                    }
                });
            }

        } catch (error) {
            console.error('Error sending email:', error);

            return res.status(500).json({
                success: false,
                message: 'Failed to send email',
                error: error.message,
                details: error.stack
            });
        }
    }
};

module.exports = emailController;