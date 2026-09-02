import nodemailer from 'nodemailer';

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_APP_PASSWORD;
const adminEmail = process.env.ADMIN_EMAIL;

const emailEnabled = Boolean(emailUser && emailPassword && adminEmail);

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function getTransporter() {
  if (!emailEnabled) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: emailUser, pass: emailPassword },
  });
}

export async function sendOrderEmail(order) {
  const transporter = getTransporter();
  if (!transporter || !order.customer_email) return { skipped: true };

  const shipped = order.status === 'shipped';
  await transporter.sendMail({
    from: `OUTLETX <${emailUser}>`,
    to: order.customer_email,
    subject: shipped ? 'Your OUTLETX order has shipped' : 'Your OUTLETX order is confirmed',
    html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px">
      <h1 style="color:#e31b23">OUTLETX</h1>
      <p>Hello ${escapeHtml(order.customer_name)},</p>
      <p>${shipped ? 'Your order has been shipped and is on its way.' : 'We received your cash-on-delivery order and will process it shortly.'}</p>
      <div style="background:#f5f5f5;padding:16px">
        <p><strong>Order:</strong> #${escapeHtml(String(order.id).slice(-6))}</p>
        <p><strong>Product:</strong> ${escapeHtml(order.product_name)}</p>
        <p><strong>Size:</strong> ${escapeHtml(order.size)}</p>
        <p><strong>Total:</strong> ${escapeHtml(order.total)} MKD</p>
      </div>
      <p>Questions? Message <a href="https://instagram.com/outletxstruga">@OutletXstruga</a>.</p>
    </div>`,
  });
  return { skipped: false };
}

export async function sendAdminNotification(order) {
  const transporter = getTransporter();
  if (!transporter) return { skipped: true };

  await transporter.sendMail({
    from: `OUTLETX <${emailUser}>`,
    to: adminEmail,
    subject: `New OUTLETX order: ${escapeHtml(order.product_name)} — ${escapeHtml(order.total)} MKD`,
    html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px">
      <h1 style="color:#e31b23">NEW ORDER</h1>
      <p><strong>Order:</strong> #${escapeHtml(String(order.id).slice(-6))}</p>
      <p><strong>Product:</strong> ${escapeHtml(order.product_brand)} ${escapeHtml(order.product_name)}</p>
      <p><strong>SKU:</strong> ${escapeHtml(order.product_sku)}</p>
      <p><strong>Size / quantity:</strong> ${escapeHtml(order.size)} / ${escapeHtml(order.quantity)}</p>
      <p><strong>Total:</strong> ${escapeHtml(order.total)} MKD</p>
      <hr />
      <p><strong>Customer:</strong> ${escapeHtml(order.customer_name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(order.customer_phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(order.customer_email)}</p>
      <p><strong>Delivery:</strong> ${escapeHtml(order.customer_address)}, ${escapeHtml(order.customer_city)}</p>
    </div>`,
  });
  return { skipped: false };
}
