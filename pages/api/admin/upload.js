import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'products');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = new IncomingForm({ uploadDir, keepExtensions: true, maxFileSize: 10 * 1024 * 1024 });

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });
    const file = files.file?.[0] || files.file;
    if (!file) return res.status(400).json({ error: 'No file' });
    const fileName = `${Date.now()}_${file.originalFilename}`;
    fs.renameSync(file.filepath, path.join(uploadDir, fileName));
    return res.status(200).json({ success: true, url: `/images/products/${fileName}` });
  });
}
