import axios from "axios";

const BREVO_API_URL = 'https://api.brevo.com/v3';

/**
 * Send email using Brevo (formerly Sendinblue)
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.toName - Recipient name (optional)
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @returns {Promise<Object>} - Response from Brevo API
 */
export const sendEmail = async (options) => {
  try {
    // Get API key and sender info at runtime (not at module load)
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
    const SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Navodaya Store';

    if (!BREVO_API_KEY) {
      console.warn('⚠️ BREVO_API_KEY not configured. Email sending disabled.');
      return { success: false, message: 'Email service not configured' };
    }

    if (!SENDER_EMAIL) {
      console.warn('⚠️ BREVO_SENDER_EMAIL not configured. Email sending disabled.');
      return { success: false, message: 'Sender email not configured' };
    }

    const response = await axios.post(
      `${BREVO_API_URL}/smtp/email`,
      {
        sender: {
          name: SENDER_NAME,
          email: SENDER_EMAIL,
        },
        to: [
          {
            email: options.to,
            name: options.toName || '',
          },
        ],
        subject: options.subject,
        htmlContent: options.html,
        textContent: options.text || '',
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Email sent successfully via Brevo');
    return { success: true, messageId: response.data.messageId };
  } catch (error) {
    console.error('❌ Error sending email via Brevo:', error.response?.data || error.message);
    throw new Error(
      `Email sending failed: ${error.response?.data?.message || error.message}`
    );
  }
};

/**
 * Send email verification link
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} verifyLink - Verification link
 * @returns {Promise<Object>}
 */
export const sendVerificationEmail = async (email, name, verifyLink) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { background-color: #f8f9fa; padding: 20px; border-radius: 5px; }
          .button { 
            display: inline-block; 
            padding: 12px 20px; 
            background-color: #c4cbce; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
          }
          .footer { margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Welcome to Navodaya Store!</h2>
          </div>
          <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>Thank you for registering with us. Please verify your email address to complete your registration.</p>
            <a href="${verifyLink}" class="button">Verify Email</a>
            <p>Or copy this link in your browser:</p>
            <p><small>${verifyLink}</small></p>
            <p style="margin-top: 20px; color: #666;">
              If you didn't create this account, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Navodaya Store. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Hello ${name},

Thank you for registering with us. Please verify your email address by clicking the link below:

${verifyLink}

If you didn't create this account, please ignore this email.

Best regards,
Navodaya Store Team
  `;

  return sendEmail({
    to: email,
    toName: name,
    subject: 'Verify Your Email - Navodaya Store',
    html,
    text,
  });
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} resetLink - Password reset link
 * @returns {Promise<Object>}
 */
export const sendPasswordResetEmail = async (email, name, resetLink) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #fff3cd; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { background-color: #f8f9fa; padding: 20px; border-radius: 5px; }
          .button { 
            display: inline-block; 
            padding: 12px 20px; 
            background-color: #dc3545; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
          }
          .footer { margin-top: 20px; font-size: 12px; color: #666; }
          .warning { color: #dc3545; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>We received a request to reset your password. Click the link below to reset it:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>Or copy this link in your browser:</p>
            <p><small>${resetLink}</small></p>
            <p class="warning">⚠️ This link will expire in 24 hours.</p>
            <p style="margin-top: 20px; color: #666;">
              If you didn't request this, please ignore this email or contact our support team.
            </p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Navodaya Store. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Hello ${name},

We received a request to reset your password. Click the link below to reset it:

${resetLink}

This link will expire in 24 hours.

If you didn't request this, please ignore this email.

Best regards,
Navodaya Store Team
  `;

  return sendEmail({
    to: email,
    toName: name,
    subject: 'Password Reset Request - Navodaya Store',
    html,
    text,
  });
};

/**
 * Send order confirmation email
 * @param {string} email - Customer email
 * @param {string} name - Customer name
 * @param {Object} order - Order details
 * @returns {Promise<Object>}
 */
export const sendOrderConfirmationEmail = async (email, name, order) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #d4edda; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { background-color: #f8f9fa; padding: 20px; border-radius: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #dee2e6; }
          th { background-color: #e9ecef; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Order Confirmation</h2>
          </div>
          <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>Thank you for your order! Here are your order details:</p>
            
            <h3>Order Information</h3>
            <table>
              <tr>
                <th>Order ID</th>
                <td>${order._id}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th>Total Amount</th>
                <td>₹${order.totalPrice?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>${order.status || 'Pending'}</td>
              </tr>
            </table>

            <h3>Shipping Address</h3>
            <p>
              ${order.address || 'Address not provided'}<br>
              ${order.phone || 'Phone: Not provided'}
            </p>

            <p style="margin-top: 20px; color: #666;">
              We'll notify you when your order is shipped. Thank you for shopping with us!
            </p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Navodaya Store. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Hello ${name},

Thank you for your order!

Order ID: ${order._id}
Date: ${new Date(order.createdAt).toLocaleDateString()}
Total: ₹${order.totalPrice?.toFixed(2) || '0.00'}
Status: ${order.status || 'Pending'}

We'll notify you when your order is shipped.

Best regards,
Navodaya Store Team
  `;

  return sendEmail({
    to: email,
    toName: name,
    subject: 'Order Confirmation - Navodaya Store',
    html,
    text,
  });
};

export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
};
