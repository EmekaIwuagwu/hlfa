import ContactMessage from '../models/ContactMessage.js';
import { sendEmail } from '../services/emailService.js';
import { contactNotificationTemplate } from '../utils/emailTemplates.js';

// @desc    Send contact email & save message
// @route   POST /api/contact/send-contact-email
// @access  Public
export const sendContactEmail = async (req, res) => {
    try {
        const contact = await ContactMessage.create(req.body);

        // Send admin notification
        await sendEmail(
            process.env.ADMIN_EMAIL,
            `New Website Inquiry: ${contact.name}`,
            contactNotificationTemplate(contact).html
        );

        res.status(201).json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
