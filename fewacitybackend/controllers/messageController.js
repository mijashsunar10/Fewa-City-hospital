import nodemailer from 'nodemailer';
import Message from '../models/Message.js';

// Setup email transporter using Gmail SMTP (no hardcoded fallback credentials)
const transporter = process.env.EMAIL_USER && process.env.EMAIL_PASS
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : null;

// @desc    Create a new message (contact form submission)
// @route   POST /api/messages
// @access  Public
export const createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide name, email, subject and message' });
    }

    const newMessage = new Message({
      name,
      email,
      phone: phone || '',
      subject,
      message,
    });

    const savedMessage = await newMessage.save();

    // Send email using Gmail App Password if configured
    if (transporter && process.env.EMAIL_USER) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
        subject: `New Hospital Contact Message: ${subject}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 600px;">
            <h2 style="color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">New Contact Message Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="margin-top: 15px; padding: 15px; background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 4px; color: #334155;">
              <strong>Message:</strong><br/>
              <p style="white-space: pre-wrap; margin-top: 8px;">${message}</p>
            </div>
            <hr style="margin-top: 20px; border: 0; border-top: 1px solid #e2e8f0;"/>
            <p style="font-size: 12px; color: #64748b;">This email was sent automatically from Fewa City Hospital Contact Form.</p>
          </div>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Nodemailer Error: Failed to send email:', error.message);
        } else {
          console.log('Email sent successfully:', info.response);
        }
      });
    } else {
      console.warn('Nodemailer skipped: EMAIL_USER or EMAIL_PASS environment variables are not set.');
    }

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting message', error: error.message });
  }
};

// @desc    Get all messages (for admin dashboard)
// @route   GET /api/messages
// @access  Private/Admin
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// @desc    Mark a message as read
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
export const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isRead = true;
    const updatedMessage = await message.save();
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error updating message status', error: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};
