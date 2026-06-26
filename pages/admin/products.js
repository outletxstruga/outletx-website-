import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminProducts() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [form, setForm] = useState({
    brand: '', name: '', sku: '', category: '', subcategory: '',
    gender: 'Unisex', ageGroup: '', oldPrice: '', newPrice: '',
    color: '', description: '', images: '', featured: false,
    sizes: [{ size: '', stock: 1 }],
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    setAuthorized(true);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(data);
  };

  const handleLogout = () => { localStorage.removeItem('admin_token'); router.push('/admin/login'); };

  const resetForm = () => {
    setForm({ brand: '', name: '', sku: '', category: '', subcategory: '', gender: 'Unisex', ageGroup: '', oldPrice: '', newPrice: '', color: '', description: '', images: '', featured: false, sizes: [{ size: '', stock: 1 }] });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setForm({
      brand: product.brand, name: product.name, sku: product.sku || '',
      category: product.category, subcategory: product.subcategory || '',
      gender: product.gender, ageGroup: product.ageGroup || '',
      oldPrice: product.oldPrice, newPrice: product.newPrice,
      color: product.color || '', description: product.description || '',
      images: Array.isArray(product.images) ? product.images.join(', ') : product.images || '',
      featured: product.featured || false,
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes.map(s => ({ size: s.size || s, stock: s.stock || 1 })) : [{ size: '', stock: 1 }],
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const addSizeRow = () => setForm({ ...form, sizes: [...form.sizes, { size: '', stock: 1 }] });
  const removeSizeRow = (i) => setForm({ ...form, sizes: form.sizes.filter((_, idx) => idx !== i) });
  const updateSize = (i, field, value) => {
    const updated = [...form.sizes];
    updated[i][field] = field === 'stock' ? parseInt(value) || 0 : value;
    setForm({ ...form, sizes: updated });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.url) setForm(prev => ({ ...prev, images: prev.images ? `${prev.images}, ${data.url}` : data.url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validSizes = form.sizes.filter(s => s.size);
    const totalStock = validSizes.reduce((sum, s) => sum + (s.stock || 0), 0);
    
    const productData = {
      ...form,
      oldPrice: parseInt(form.oldPrice), newPrice: parseInt(form.newPrice),
      discount: Math.round(((parseInt(form.oldPrice) - parseInt(form.newPrice)) / parseInt(form.oldPrice)) * 100),
      sizes: validSizes,
      images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      ageGroup: form.ageGroup || null,
      inStock: totalStock > 0,
    };
    
    if (editingProduct) {
      await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingProduct.id, ...productData }) });
    } else {
      await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) });
    }
    resetForm();
    fetchProducts();
  };

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: product.id }) });
    fetchProducts();
  };

  const updateSizeStock = async (product, sizeIndex, delta) => {
    const updatedSizes = [...product.sizes];
    updatedSizes[sizeIndex] = { ...updatedSizes[sizeIndex], stock: Math.max(0, (updatedSizes[sizeIndex].stock || 0) + delta) };
    const totalStock = updatedSizes.reduce((sum, s) => sum + (s.stock || 0), 0);
    await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: product.id, sizes: updatedSizes, inStock: totalStock > 0 }) });
    fetchProducts();
  };

  if (!authorized) return null;

  const brands = [...new Set(products.map(p => p.brand))].sort();
  const categories = [...new Set(products.map(p => p.category))].sort();

  let filtered = products;
  if (search) { const q = search.toLowerCase(); filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)); }
  if (filterBrand !== 'all') filtered = filtered.filter(p => p.brand === filterBrand);
  if (filterCategory !== 'all') filtered = filtered.filter(p => p.category === filterCategory);
  if (filterStock === 'low') filtered = filtered.filter(p => p.inStock && p.sizes && p.sizes.some(s => s.stock > 0 && s.stock <= 3));
  if (filterStock === 'out') filtered = filtered.filter(p => !p.inStock || !p.sizes || p.sizes.every(s => (s.stock || 0) === 0));
  if (filterStock === 'in') filtered = filtered.filter(p => p.inStock && p.sizes && p.sizes.some(s => s.stock > 3));

  const IS = { width: '100%', padding: 10, border: '1px solid #E5E5E5', fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' };
  const LS = { display: 'block', fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#999', marginBottom: 4 };

  return (
    <>
      <Head><title>Products | OUTLETX Admin</title></Head>
      <div style={{minHeight: '100vh', background: '#F5F5F5', fontFamily: 'Inter, sans-serif'}}>
        <div style={{background: '#000000', color: '#FFFFFF', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 900, margin: 0}}>OUTLET<span style={{color: '#DC2626'}}>X</span> <span style={{color: '#888', fontSize: 12, fontWeight: 400}}>Products</span></h1>
          <div style={{display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap'}}>
            <button onClick={() => { resetForm(); setShowForm(true); }} style={{background: '#DC2626', color: '#FFF', border: 'none', fontSize: 11, fontWeight: 700, padding: '8px 16px', cursor: 'pointer'}}>+ Add Product</button>
            <a href="/admin" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Dashboard</a>
            <a href="/admin/orders" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Orders</a>
            <button onClick={handleLogout} style={{background: 'transparent', color: '#FFF', border: '1px solid #444', fontSize: 11, fontWeight: 700, padding: '6px 14px', cursor: 'pointer'}}>Logout</button>
          </div>
        </div>

        <div style={{maxWidth: 1500, margin: '0 auto', padding: '24px'}}>
          {showForm && (
            <div style={{background: '#FFFFFF', padding: 24, marginBottom: 24, border: '1px solid #F0F0F0'}}>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 20}}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14}}>
                  <div><label style={LS}>Brand *</label><input required style={IS} value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value})} placeholder="Nike" /></div>
                  <div><label style={LS}>Product Name *</label><input required style={IS} value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Air Max 90" /></div>
                  <div><label style={LS}>SKU *</label><input required style={IS} value={form.sku} onChange={(e) => setForm({...form, sku: e.target.value})} placeholder="DM0029-101" /></div>
                  <div><label style={LS}>Category *</label><select required style={IS} value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}><option value="">Select...</option><option>Shoes</option><option>Shirts</option><option>Hoodies</option><option>Jackets</option><option>Pants</option><option>Shorts</option><option>Swimwear</option><option>Accessories</option></select></div>
                  <div><label style={LS}>Subcategory</label><input style={IS} value={form.subcategory} onChange={(e) => setForm({...form, subcategory: e.target.value})} placeholder="Running" /></div>
                  <div><label style={LS}>Gender *</label><select required style={IS} value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value})}><option>Men</option><option>Women</option><option>Kids</option><option>Unisex</option></select></div>
                  <div><label style={LS}>Age Group</label><select style={IS} value={form.ageGroup} onChange={(e) => setForm({...form, ageGroup: e.target.value})}><option value="">None</option><option value="0-3">0-3</option><option value="4-8">4-8</option><option value="9-14">9-14</option></select></div>
                  <div><label style={LS}>Featured</label><select style={IS} value={form.featured ? 'yes' : 'no'} onChange={(e) => setForm({...form, featured: e.target.value === 'yes'})}><option value="no">No</option><option value="yes">Yes — Show on homepage</option></select></div>
                  <div><label style={LS}>Old Price (MKD) *</label><input required type="number" style={IS} value={form.oldPrice} onChange={(e) => setForm({...form, oldPrice: e.target.value})} /></div>
                  <div><label style={LS}>New Price (MKD) *</label><input required type="number" style={IS} value={form.newPrice} onChange={(e) => setForm({...form, newPrice: e.target.value})} /></div>
                  <div><label style={LS}>Color</label><input style={IS} value={form.color} onChange={(e) => setForm({...form, color: e.target.value})} placeholder="Black/White" /></div>
                  <div><label style={LS}>Description</label><textarea rows={2} style={IS} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} /></div>
                  <div><label style={LS}>Images</label><input style={IS} value={form.images} onChange={(e) => setForm({...form, images: e.target.value})} placeholder="URLs (comma separated)" /><input type="file" accept="image/*" onChange={handleImageUpload} style={{marginTop: 6, fontSize: 11}} disabled={uploading} />{uploading && <span style={{fontSize: 10, color: '#999'}}>Uploading...</span>}</div>
                </div>
                
                <div style={{marginTop: 20}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                    <label style={{...LS, marginBottom: 0}}>Sizes & Stock *</label>
                    <button type="button" onClick={addSizeRow} style={{background: '#000', color: '#FFF', border: 'none', fontSize: 10, fontWeight: 700, padding: '5px 12px', cursor: 'pointer'}}>+ Add Size</button>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8}}>
                    {form.sizes.map((s, i) => (
                      <div key={i} style={{display: 'flex', gap: 4, alignItems: 'center'}}>
                        <input required style={{...IS, width: 60}} value={s.size} onChange={(e) => updateSize(i, 'size', e.target.value)} placeholder="42" />
                        <input type="number" min="0" style={{...IS, width: 50}} value={s.stock} onChange={(e) => updateSize(i, 'stock', e.target.value)} placeholder="Qty" />
                        {form.sizes.length > 1 && (
                          <button type="button" onClick={() => removeSizeRow(i)} style={{background: '#DC2626', color: '#FFF', border: 'none', fontSize: 14, cursor: 'pointer', width: 24, height: 24, lineHeight: 1}}>&times;</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p style={{fontSize: 10, color: '#999', marginTop: 6}}>Total stock: {form.sizes.reduce((sum, s) => sum + (parseInt(s.stock) || 0), 0)}</p>
                </div>

                <div style={{display: 'flex', gap: 10, marginTop: 20}}>
                  <button type="submit" style={{background: '#DC2626', color: '#FFF', border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '12px 28px', cursor: 'pointer'}}>{editingProduct ? 'Update' : 'Add Product'}</button>
                  <button type="button" onClick={resetForm} style={{background: 'transparent', color: '#000', border: '1px solid #E5E5E5', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '12px 28px', cursor: 'pointer'}}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20}}>
            {[
              { label: 'Total', value: products.length },
              { label: 'In Stock', value: products.filter(p => p.inStock).length },
              { label: 'Low Stock', value: products.filter(p => p.inStock && p.sizes && p.sizes.some(s => s.stock > 0 && s.stock <= 3)).length },
              { label: 'Out of Stock', value: products.filter(p => !p.inStock || !p.sizes || p.sizes.every(s => (s.stock || 0) === 0)).length },
            ].map(s => (
              <div key={s.label} style={{background: '#FFF', padding: 14, border: '1px solid #F0F0F0', textAlign: 'center'}}>
                <p style={{fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 900, margin: '0 0 2px'}}>{s.value}</p>
                <p style={{color: '#999', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: 0}}>{s.label}</p>
              </div>
            ))}
          </div>

          <div style={{display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center'}}>
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{flex: 1, minWidth: 180, padding: '8px 14px', border: '1px solid #E5E5E5', fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none'}} />
            <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} style={{padding: '8px 12px', border: '1px solid #E5E5E5', fontSize: 12, fontFamily: 'Inter, sans-serif', cursor: 'pointer'}}><option value="all">All Brands</option>{brands.map(b => <option key={b} value={b}>{b}</option>)}</select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{padding: '8px 12px', border: '1px solid #E5E5E5', fontSize: 12, fontFamily: 'Inter, sans-serif', cursor: 'pointer'}}><option value="all">All Categories</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
            <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)} style={{padding: '8px 12px', border: '1px solid #E5E5E5', fontSize: 12, fontFamily: 'Inter, sans-serif', cursor: 'pointer'}}><option value="all">All Stock</option><option value="in">In Stock</option><option value="low">Low Stock</option><option value="out">Out of Stock</option></select>
            <span style={{color: '#999', fontSize: 12, whiteSpace: 'nowrap'}}>{filtered.length} products</span>
          </div>

          <div style={{background: '#FFF', padding: 20, border: '1px solid #F0F0F0', overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 1000}}>
              <thead>
                <tr style={{borderBottom: '2px solid #000'}}>
                  <th style={th}>ID</th><th style={th}>Product</th><th style={th}>SKU</th><th style={th}>Brand</th><th style={th}>Category</th><th style={th}>Price</th><th style={th}>Featured</th><th style={th}>Sizes (Stock)</th><th style={th}>Total</th><th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const totalStock = p.sizes ? p.sizes.reduce((sum, s) => sum + (s.stock || 0), 0) : 0;
                  return (
                    <tr key={p.id} style={{borderBottom: '1px solid #F0F0F0'}}>
                      <td style={td}>{p.id}</td>
                      <td style={{...td, fontWeight: 600}}>{p.name}</td>
                      <td style={{...td, color: '#999', fontSize: 10}}>{p.sku}</td>
                      <td style={{...td, color: '#DC2626', fontWeight: 600, fontSize: 10, textTransform: 'uppercase'}}>{p.brand}</td>
                      <td style={td}>{p.category}</td>
                      <td style={{...td, fontWeight: 700}}>{p.newPrice} MKD</td>
                      <td style={td}>{p.featured ? <span style={{color: '#DC2626', fontWeight: 700}}>YES</span> : <span style={{color: '#999'}}>No</span>}</td>
                      <td style={td}>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: 4}}>
                          {p.sizes && p.sizes.map((s, i) => (
                            <span key={i} style={{background: (s.stock || 0) <= 2 ? '#FEF2F2' : '#F5F5F5', color: (s.stock || 0) <= 2 ? '#DC2626' : '#000', padding: '2px 6px', fontSize: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3, borderRadius: 2}}>
                              {s.size}: {s.stock || 0}
                              <button onClick={() => updateSizeStock(p, i, -1)} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1, color: '#999'}}>-</button>
                              <button onClick={() => updateSizeStock(p, i, 1)} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1, color: '#999'}}>+</button>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{...td, fontWeight: 700, color: totalStock <= 5 ? '#DC2626' : '#16A34A'}}>{totalStock}</td>
                      <td style={td}>
                        <button onClick={() => handleEdit(p)} style={{background: '#000', color: '#FFF', border: 'none', padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', marginRight: 4}}>Edit</button>
                        <button onClick={() => handleDelete(p)} style={{background: '#DC2626', color: '#FFF', border: 'none', padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer'}}>Del</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

const th = { textAlign: 'left', padding: '8px 6px', fontWeight: 700, textTransform: 'uppercase', fontSize: 9, letterSpacing: 1, whiteSpace: 'nowrap' };
const td = { padding: '8px 6px', whiteSpace: 'nowrap', fontSize: 11 };