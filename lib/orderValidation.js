export function makeOrderRows(body, products, settings) {
  const items = body?.items;
  if (!Array.isArray(items) || !items.length || items.length > 30) throw new Error('Your bag must contain between 1 and 30 items.');
  const customer = body.customerInfo || {};
  const limits = { fullName: 150, phone: 50, email: 254, city: 150, address: 400 };
  for (const [key, limit] of Object.entries(limits)) {
    if (typeof customer[key] !== 'string' || !customer[key].trim() || customer[key].length > limit) throw new Error('Complete all delivery details.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) throw new Error('Enter a valid email address.');
  if (customer.notes && (typeof customer.notes !== 'string' || customer.notes.length > 2000)) throw new Error('Keep delivery notes under 2,000 characters.');
  const seen = new Set();
  const rows = items.map((item, index) => {
    const product = products.find((p) => p.id === Number(item.id));
    const size = product?.sizes?.find((s) => s.size === String(item.size));
    const key = String(item.id) + ':' + String(item.size);
    if (seen.has(key)) throw new Error('Combine duplicate sizes in your bag.');
    seen.add(key);
    if (!product?.inStock || !size || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 50 || item.quantity > size.stock) throw new Error('An item or size is no longer available in that quantity. Please update your bag.');
    if (item.price !== product.newPrice) throw new Error('A product price has changed. Refresh the page and review your bag.');
    return {
      checkout_id: body.checkoutId, line_index: index,
      product_name: product.name, product_brand: product.brand, product_sku: product.sku,
      product_price: product.newPrice, size: size.size, quantity: item.quantity,
      total: product.newPrice * item.quantity, status: 'pending',
      customer_name: customer.fullName.trim(), customer_phone: customer.phone.trim(),
      customer_email: customer.email.trim(), customer_city: customer.city.trim(),
      customer_address: customer.address.trim(), customer_notes: customer.notes || ''
    };
  });
  const subtotal = rows.reduce((sum, row) => sum + row.total, 0);
  const delivery = subtotal >= settings.freeDeliveryOver ? 0 : settings.deliveryFee;
  if (body.total !== subtotal + delivery) throw new Error('Delivery or prices have changed. Refresh the page and review the total.');
  rows[0].total += delivery;
  return rows;
}
