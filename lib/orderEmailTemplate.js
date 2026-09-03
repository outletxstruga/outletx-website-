const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const amount=value=>Number(value||0).toLocaleString('en-US')+' MKD';
const copy={
 pending:{subject:'We received your OUTLETX order',heading:'ORDER RECEIVED',message:'We received your cash-on-delivery order. Keep the reference below; we will review the product, size and delivery details.'},
 shipped:{subject:'Your OUTLETX order has shipped',heading:'ORDER SHIPPED',message:'Your order has been handed over for delivery and is on its way.'},
 delivered:{subject:'Your OUTLETX order was delivered',heading:'ORDER DELIVERED',message:'Your order is marked as delivered. We hope you enjoy your new pair.'},
};

export function buildOrderEmail(input,{admin=false}={}){
 const rows=Array.isArray(input)?input:[input],order=rows[0];
 if(!order)throw new Error('An order is required to prepare an email.');
 const reference=String(order.checkout_id||order.id),status=copy[order.status]||copy.pending;
 const subtotal=rows.reduce((sum,row)=>sum+Number(row.product_price)*Number(row.quantity),0);
 const total=rows.reduce((sum,row)=>sum+Number(row.total||0),0),delivery=Math.max(0,total-subtotal);
 const subject=admin?'New OUTLETX order — '+reference:status.subject;
 const intro=admin?'A new cash-on-delivery order needs your review.':status.message;
 const itemText=rows.map(row=>`${row.product_brand||''} ${row.product_name||''} — Size ${row.size}, Qty ${row.quantity}: ${amount(Number(row.product_price)*Number(row.quantity))}`).join('\n');
 const itemHtml=rows.map(row=>`<tr><td style="padding:12px 0;border-bottom:1px solid #ddd">${esc(row.product_brand)} ${esc(row.product_name)}<br><small>Size ${esc(row.size)} · Qty ${esc(row.quantity)}${admin?' · SKU '+esc(row.product_sku):''}</small></td><td style="padding:12px 0;border-bottom:1px solid #ddd;text-align:right">${amount(Number(row.product_price)*Number(row.quantity))}</td></tr>`).join('');
 const adminText=admin?`\nCustomer: ${order.customer_name}\nPhone: ${order.customer_phone}\nEmail: ${order.customer_email}\nDelivery: ${order.customer_address}, ${order.customer_city}\nNotes: ${order.customer_notes||'—'}\n`:'';
 const adminHtml=admin?`<p><strong>Customer:</strong> ${esc(order.customer_name)}<br><strong>Phone:</strong> ${esc(order.customer_phone)}<br><strong>Email:</strong> ${esc(order.customer_email)}<br><strong>Delivery:</strong> ${esc(order.customer_address)}, ${esc(order.customer_city)}</p><p><strong>Notes:</strong> ${esc(order.customer_notes||'—')}</p>`:'';
 return {subject,
  text:`OUTLETX\n${admin?'NEW ORDER':status.heading}\n\nHello ${order.customer_name},\n${intro}\n\nReference: ${reference}\n${itemText}\nSubtotal: ${amount(subtotal)}\nDelivery: ${amount(delivery)}\nTotal: ${amount(total)}\n${adminText}\nQuestions? Message @OutletXstruga and include your reference.\nOutletX · Dua Mall, Struga`,
  html:`<div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;color:#111"><h1 style="margin:0;color:#e31b23">OUTLETX</h1><p style="font-size:13px;letter-spacing:2px;font-weight:bold">${admin?'NEW ORDER':status.heading}</p><p>Hello ${esc(order.customer_name)},</p><p>${intro}</p><div style="background:#f5f5f5;padding:18px;margin:24px 0"><p style="margin-top:0"><strong>Reference:</strong> ${esc(reference)}</p><table style="border-collapse:collapse;width:100%">${itemHtml}</table><p style="text-align:right">Subtotal: ${amount(subtotal)}<br>Delivery: ${amount(delivery)}<br><strong>Total: ${amount(total)}</strong></p></div>${adminHtml}<p>Questions? Message <a href="https://instagram.com/outletxstruga">@OutletXstruga</a> and include your reference.</p><p style="color:#666;font-size:13px">OutletX · Dua Mall, Struga</p></div>`
 };
}
