const nodemailer = require('nodemailer');

const sendOrderEmail = async (order, user) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Order Confirmation - #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Thank you for your order!</h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #495057; margin-bottom: 10px;">Order Details</h2>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>

          <div style="background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #495057; margin-bottom: 15px;">Items Ordered</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #dee2e6;">
                  <th style="text-align: left; padding: 10px; color: #495057;">Product</th>
                  <th style="text-align: center; padding: 10px; color: #495057;">Size</th>
                  <th style="text-align: center; padding: 10px; color: #495057;">Quantity</th>
                  <th style="text-align: right; padding: 10px; color: #495057;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 10px;">${item.name}</td>
                    <td style="text-align: center; padding: 10px;">${item.size}</td>
                    <td style="text-align: center; padding: 10px;">${item.qty}</td>
                    <td style="text-align: right; padding: 10px;">$${item.price.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="text-align: right; margin: 20px 0;">
            <h2 style="color: #28a745;">Total: $${order.totalPrice.toFixed(2)}</h2>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6c757d;">We'll send you another email when your order ships.</p>
            <p style="color: #6c757d;">If you have any questions, please contact our customer support.</p>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 12px;">© 2024 Clothing Store. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send order confirmation email');
  }
};

module.exports = sendOrderEmail;
