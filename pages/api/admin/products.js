import fs from 'fs';
import path from 'path';

const productsFile = path.join(process.cwd(), 'data', 'products.js');

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
    return res.status(200).json(getProducts());
  }
  if (req.method === 'POST') {
    const products = getProducts();
    const newProduct = { id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1, ...req.body, inStock: true, featured: false };
    products.push(newProduct);
    saveProducts(products);
    return res.status(200).json({ success: true, product: newProduct });
  }
  if (req.method === 'PUT') {
    const products = getProducts();
    const { id, ...updates } = req.body;
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Not found' });
    products[index] = { ...products[index], ...updates };
    saveProducts(products);
    return res.status(200).json({ success: true });
  }
  if (req.method === 'DELETE') {
    const products = getProducts();
    const { id } = req.body;
    saveProducts(products.filter(p => p.id !== id));
    return res.status(200).json({ success: true });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

