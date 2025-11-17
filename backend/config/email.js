const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send order confirmation email
const sendOrderConfirmation = async (order, customerEmail) => {
  const productsHtml = order.products.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.name}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.size}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ₹${(item.price * item.quantity).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: `Order Confirmation - #${order._id.toString().slice(-6)}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">FASHION STORE</h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Order Confirmation</p>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Thank you for your order!</h2>
                    <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                      Hi ${order.customerInfo.name},<br><br>
                      Your order has been confirmed and will be shipped soon. Here are your order details:
                    </p>
                    
                    <!-- Order Info -->
                    <table width="100%" style="margin: 20px 0; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                      <tr style="background-color: #f8f9fa;">
                        <td style="padding: 15px; font-weight: bold; color: #333;">Order Number:</td>
                        <td style="padding: 15px; color: #667eea; font-weight: bold;">#${order._id.toString().slice(-6)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 15px; font-weight: bold; color: #333; border-top: 1px solid #eee;">Order Date:</td>
                        <td style="padding: 15px; color: #666; border-top: 1px solid #eee;">${new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                      </tr>
                      <tr>
                        <td style="padding: 15px; font-weight: bold; color: #333; border-top: 1px solid #eee;">Status:</td>
                        <td style="padding: 15px; color: #666; border-top: 1px solid #eee;">
                          <span style="background-color: #fff3cd; color: #856404; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold;">
                            ${order.status}
                          </span>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Products -->
                    <h3 style="margin: 30px 0 15px 0; color: #333; font-size: 18px;">Order Items</h3>
                    <table width="100%" style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                      <thead>
                        <tr style="background-color: #f8f9fa;">
                          <th style="padding: 12px; text-align: left; color: #333; font-weight: bold;">Product</th>
                          <th style="padding: 12px; text-align: center; color: #333; font-weight: bold;">Size</th>
                          <th style="padding: 12px; text-align: center; color: #333; font-weight: bold;">Qty</th>
                          <th style="padding: 12px; text-align: right; color: #333; font-weight: bold;">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${productsHtml}
                      </tbody>
                      <tfoot>
                        <tr style="background-color: #f8f9fa;">
                          <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; color: #333; border-top: 2px solid #667eea;">Total:</td>
                          <td style="padding: 15px; text-align: right; font-weight: bold; color: #667eea; font-size: 18px; border-top: 2px solid #667eea;">₹${order.totalPrice.toLocaleString('en-IN')}</td>
                        </tr>
                      </tfoot>
                    </table>
                    
                    <!-- Shipping Info -->
                    <h3 style="margin: 30px 0 15px 0; color: #333; font-size: 18px;">Shipping Address</h3>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; color: #666; line-height: 1.8;">
                      <strong>${order.customerInfo.name}</strong><br>
                      ${order.customerInfo.address.street}<br>
                      ${order.customerInfo.address.city}, ${order.customerInfo.address.state}<br>
                      ${order.customerInfo.address.pincode}<br>
                      Phone: ${order.customerInfo.phone}
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
                    <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                      If you have any questions, please contact us at<br>
                      <a href="mailto:support@fashionstore.com" style="color: #667eea; text-decoration: none;">support@fashionstore.com</a>
                    </p>
                    <p style="margin: 20px 0 0 0; color: #999; font-size: 12px;">
                      © ${new Date().getFullYear()} Fashion Store. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send order notification to admin
const sendAdminOrderNotification = async (order) => {
  const productsHtml = order.products.map(item => `
    <li>${item.name} - Size: ${item.size}, Qty: ${item.quantity}, Price: ₹${(item.price * item.quantity).toLocaleString('en-IN')}</li>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Order Received - #${order._id.toString().slice(-6)}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #667eea; margin-top: 0;">New Order Received!</h2>
          <p><strong>Order ID:</strong> #${order._id.toString().slice(-6)}</p>
          <p><strong>Customer:</strong> ${order.customerInfo.name}</p>
          <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalPrice.toLocaleString('en-IN')}</p>
          
          <h3>Order Items:</h3>
          <ul style="line-height: 1.8;">
            ${productsHtml}
          </ul>
          
          <h3>Shipping Address:</h3>
          <p style="line-height: 1.8;">
            ${order.customerInfo.address.street}<br>
            ${order.customerInfo.address.city}, ${order.customerInfo.address.state}<br>
            ${order.customerInfo.address.pincode}
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <a href="${process.env.CLIENT_URL}/admin" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View in Dashboard
            </a>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset Request - Fashion Store',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #667eea; margin: 0;">FASHION STORE</h1>
          </div>
          
          <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #666; line-height: 1.6;">
            You are receiving this email because you (or someone else) has requested to reset your password.
          </p>
          <p style="color: #666; line-height: 1.6;">
            Please click the button below to reset your password. This link will expire in 1 hour.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; font-size: 14px;">
            If you did not request this, please ignore this email and your password will remain unchanged.
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${resetUrl}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  transporter,
  sendOrderConfirmation,
  sendAdminOrderNotification,
  sendPasswordResetEmail,
};