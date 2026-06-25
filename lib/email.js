import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'edmi9011@gmail.com',
    pass: 'gcku mcia oajj jwol',
  },
});

export async function sendOrderEmail(order) {
  const mailOptions = {
    from: 'OUTLETX <edmi9011@gmail.com>',
    to: order.customer_email,
    subject: 'Your OUTLETX Order - ' + (order.status === 'shipped' ? 'Has Been Shipped!' : 'Confirmed!'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #DC2626; font-size: 24px;">OUTLETX</h1>
        <p>Hello ${order.customer_name},</p>
        ${order.status === 'shipped' 
          ? '<p>Your order has been <strong>shipped</strong> and is on its way!</p>'
          : '<p>Thank you for your order! We have received it and will process it shortly.</p>'
        }
        <div style="background: #F5F5F5; padding: 16px; margin: 16px 0;">
          <p><strong>Order:</strong> #${String(order.id).slice(-6)}</p>
          <p><strong>Product:</strong> ${order.product_name}</p>
          <p><strong>Brand:</strong> ${order.product_brand}</p>
          <p><strong>Size:</strong> ${order.size}</p>
          <p><strong>Total:</strong> ${order.total} MKD</p>
        </div>
        <p>If you have any questions, message us on Instagram: <a href="https://instagram.com/outletxstruga">@outletxstruga</a></p>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">OUTLETX - Dua Mall, Struga, North Macedonia</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}