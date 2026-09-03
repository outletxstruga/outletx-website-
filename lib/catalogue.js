export function discountOf(product) {
  return product.oldPrice > product.newPrice && product.oldPrice > 0
    ? Math.round((1 - product.newPrice / product.oldPrice) * 100) : 0;
}
export function stockOf(product, size) {
  if (!product || product.inStock === false) return 0;
  return (product.sizes || []).filter(s => !size || String(s.size) === String(size))
    .reduce((total, s) => total + Math.max(0, Number(s.stock) || 0), 0);
}
export function money(value) { return Number(value || 0).toLocaleString('en-US') + ' MKD'; }
export function groupLabel(value) {
  return ({ men: 'Men', women: 'Women', kids: 'Kids', unisex: 'Unisex' })[String(value || '').toLowerCase()] || value || 'All products';
}
export function filterProducts(products, filters) {
  const query = (filters.search || '').trim().toLowerCase();
  const list = products.filter(p =>
    (!filters.gender || p.gender?.toLowerCase() === filters.gender.toLowerCase()) &&
    (!filters.brand || p.brand?.toLowerCase() === filters.brand.toLowerCase()) &&
    (!filters.category || p.category?.toLowerCase() === filters.category.toLowerCase()) &&
    (!query || `${p.brand} ${p.name} ${p.sku}`.toLowerCase().includes(query)) &&
    (filters.stock === 'all' || stockOf(p) > 0) &&
    (!filters.size || stockOf(p, filters.size) > 0) &&
    (!filters.max || p.newPrice <= Number(filters.max)) &&
    (!filters.min || p.newPrice >= Number(filters.min))
  );
  const compare = {
    'price-low': (a,b) => a.newPrice-b.newPrice,
    'price-high': (a,b) => b.newPrice-a.newPrice,
    newest: (a,b) => b.id-a.id,
    discount: (a,b) => discountOf(b)-discountOf(a),
  }[filters.sort] || ((a,b) => Number(b.featured)-Number(a.featured) || b.id-a.id);
  return list.sort(compare);
}
