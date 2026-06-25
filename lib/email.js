import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'edmi9011@gmail.com',
    pass: 'gcku mcia oajj jwol',
  },
});

export async function sendOrderEmail(order) {
  const isShipped = order.status === 'shipped';
  
  const mailOptions = {
    from: 'OUTLETX <YOUR_GMAIL@gmail.com>',
    to: order.customer_email,
    subject: isShipped ? 'Your OUTLETX Order Has Been Shipped!' : 'Your OUTLETX Order Is Confirmed!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #DC2626; font-size: 24px;">OUTLETX</h1>
        <p>Hello ${order.customer_name},</p>
        ${isShipped 
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
        <p>Questions? Message us on Instagram: <a href="https://instagram.com/outletxstruga">@outletxstruga</a></p>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">OUTLETX - Dua Mall, Struga, North Macedonia</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendAdminNotification(order) {
  const mailOptions = {
    from: 'OUTLETX <edmi9011@gmail.com>',
    to: 'edmi9011@gmail.com',
    subject: 'NEW ORDER - ' + order.product_name + ' - ' + order.total + ' MKD',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #DC2626; font-size: 24px;">NEW ORDER</h1>
        <div style="background: #F5F5F5; padding: 16px; margin: 16px 0;">
          <p><strong>Order:</strong> #${String(order.id).slice(-6)}</p>
          <p><strong>Date:</strong> ${new Date(order.created_at || Date.now()).toLocaleString()}</p>
          <p><strong>Product:</strong> ${order.product_name}</p>
          <p><strong>Brand:</strong> ${order.product_brand}</p>
          <p><strong>SKU:</strong> ${order.product_sku}</p>
          <p><strong>Size:</strong> ${order.size}</p>
          <p><strong>Quantity:</strong> ${order.quantity}</p>
          <p><strong>Total:</strong> ${order.total} MKD</p>
        </div>
        <div style="background: #FFF7ED; padding: 16px; margin: 16px 0;">
          <p><strong>Customer:</strong> ${order.customer_name}</p>
          <p><strong>Phone:</strong> ${order.customer_phone}</p>
          <p><strong>Email:</strong> ${order.customer_email}</p>
          <p><strong>City:</strong> ${order.customer_city}</p>
          <p><strong>Address:</strong> ${order.customer_address}</p>
          <p><strong>Card Last 4:</strong> ${order.card_last4}</p>
        </div>
        <p style="color: #999; font-size: 12px;">Login to admin: your-site.vercel.app/admin</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}