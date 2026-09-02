import { getDatabase } from './supabase';
import seedProducts from '../data/products';
import seedContent from '../data/content.json';

export function localPreviewOnly() {
  return process.env.NODE_ENV !== 'production' && !process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export async function getProducts() {
  if (localPreviewOnly()) return seedProducts;
  const { data, error } = await getDatabase().from('outletx_products').select('id,data,revision').order('id');
  if (error) throw error;
  return data.map((row) => ({ ...row.data, id: row.id, _revision: row.revision }));
}

export async function getContent() {
  if (localPreviewOnly()) return seedContent;
  const { data, error } = await getDatabase().from('outletx_content').select('data,revision').eq('id', 'main').single();
  if (error) throw error;
  return { ...data.data, _revision: data.revision };
}

export function safeUrl(value) {
  return typeof value === 'string' && !value.includes('\\') &&
    ((value.startsWith('/') && !value.startsWith('//')) || /^https:\/\//i.test(value));
}

export function validateProduct(input) {
  const product = { ...input };
  delete product.id;
  delete product._revision;
  for (const key of ['name', 'brand', 'sku', 'category', 'gender']) {
    if (typeof product[key] !== 'string' || !product[key].trim() || product[key].length > 200) throw new Error('Complete the product name, brand, SKU, category and customer group.');
  }
  for (const key of ['newPrice', 'oldPrice']) {
    if (!Number.isFinite(product[key]) || product[key] < 0 || product[key] > 10000000) throw new Error('Enter valid prices.');
  }
  if (!Array.isArray(product.images) || !product.images.length || product.images.length > 20 || product.images.some((url) => !safeUrl(url))) throw new Error('Add at least one valid product image.');
  if (!Array.isArray(product.sizes) || !product.sizes.length || product.sizes.length > 100 || product.sizes.some((s) => typeof s.size !== 'string' || !s.size.trim() || !Number.isInteger(s.stock) || s.stock < 0)) throw new Error('Enter valid sizes and whole-number stock quantities.');
  product.sizes = product.sizes.map((s) => ({ size: s.size.trim(), stock: s.stock }));
  if (new Set(product.sizes.map((s) => s.size)).size !== product.sizes.length) throw new Error('Each size must appear only once.');
  product.featured = !!product.featured;
  product.inStock = product.sizes.some((s) => s.stock > 0);
  product.discount = product.oldPrice > 0 ? Math.max(0, Math.round((1 - product.newPrice / product.oldPrice) * 100)) : 0;
  return product;
}

export function validateContent(content) {
  if (!Array.isArray(content.slides) || !content.slides.length || content.slides.length > 20) throw new Error('Keep between one and twenty homepage slides.');
  for (const slide of content.slides) {
    if (!safeUrl(slide.image)) throw new Error('Use a valid slide image.');
    for (const key of ['link', 'link2', 'link3']) if (slide[key] && !safeUrl(slide[key])) throw new Error('Slide links must start with / or https://.');
  }
  const settings = content.settings;
  if (!settings || ['deliveryFee', 'freeDeliveryOver'].some((key) => !Number.isFinite(settings[key]) || settings[key] < 0)) throw new Error('Enter valid delivery charges.');
  for (const key of ['instagram', 'address', 'country']) if (typeof settings[key] !== 'string' || !settings[key].trim()) throw new Error('Complete the store details.');
  if (!settings.openingHours || ['weekdays', 'sunday'].some((key) => typeof settings.openingHours[key] !== 'string' || !settings.openingHours[key].trim())) throw new Error('Complete the opening hours.');
  return { slides: content.slides, settings };
}
