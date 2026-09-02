import { IncomingForm } from 'formidable';
import fs from 'fs/promises';
import os from 'os';
import crypto from 'crypto';
import { requireAdmin } from '../../../lib/adminAuth';
import { getDatabase } from '../../../lib/supabase';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!requireAdmin(req, res)) return;
  const temporaryFiles = [];
  try {
    const database = getDatabase();
    const form = new IncomingForm({ uploadDir: os.tmpdir(), maxFiles: 1, maxFileSize: 4 * 1024 * 1024, maxTotalFileSize: 4 * 1024 * 1024, maxFields: 1 });
    form.on('fileBegin', (_name, file) => temporaryFiles.push(file.filepath));
    const [, files] = await form.parse(req);
    const file = files.file?.[0];
    if (!file) return res.status(400).json({ error: 'Choose one JPG, PNG or WebP image under 4 MB.' });
    const bytes = await fs.readFile(file.filepath);
    const png = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
    const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    const webp = bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
    const type = png ? ['png', 'image/png'] : jpeg ? ['jpg', 'image/jpeg'] : webp ? ['webp', 'image/webp'] : null;
    if (!type) return res.status(400).json({ error: 'Only JPG, PNG and WebP images are supported.' });
    const name = crypto.randomUUID() + '.' + type[0];
    const bucket = database.storage.from('outletx-product-images');
    const { error } = await bucket.upload(name, bytes, { contentType: type[1], upsert: false });
    if (error) throw error;
    return res.status(200).json({ success: true, url: bucket.getPublicUrl(name).data.publicUrl });
  } catch {
    return res.status(503).json({ error: 'Image upload failed. Use a JPG, PNG or WebP under 4 MB and try again.' });
  } finally {
    await Promise.all(temporaryFiles.map((file) => fs.unlink(file).catch(() => {})));
  }
}
