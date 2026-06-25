import fs from 'fs';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'data', 'orders.json');
const productsFile = path.join(process.cwd(), 'data', 'products.js');

function getOrders() {
  try {
    const data = fs.readFileSync(ordersFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

function getProducts() {
  try {
    const content = fs.readFileSync(productsFile, 'utf8');
    const match = content.match(/const products = (\[[\s\S]*\]);/);
    if (match) return JSON.parse(match[1]);
    return [];
  } catch {
    return [];
  }
}

function saveProducts(products) {
  const content = `const products = ${JSON.stringify(products, null, 2)};\n\nmodule.exports = products;`;
  fs.writeFileSync(productsFile, content);
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(getOrders());
  }

  if (req.method === 'POST') {
    const order = {
      id: Date.now(),
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Decrease stock
    if (order.product?.id) {
      const products = getProducts();
      const index = products.findIndex(p => p.id === order.product.id);
      if (index !== -1 && products[index].stock) {
        products[index].stock = Math.max(0, products[index].stock - (order.quantity || 1));
        if (products[index].stock === 0) {
          products[index].inStock = false;
        }
        saveProducts(products);
      }
    }

    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    return res.status(200).json({ success: true, order });
  }

  if (req.method === 'PUT') {
    const { id, status } = req.body;
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return res.status(404).json({ error: 'Not found' });
    orders[index].status = status;
    saveOrders(orders);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}