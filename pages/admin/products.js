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
    sizes: '', color: '', description: '', images: '', stock: '10',
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
    setForm({ brand: '', name: '', sku: '', category: '', subcategory: '', gender: 'Unisex', ageGroup: '', oldPrice: '', newPrice: '', sizes: '', color: '', description: '', images: '', stock: '10' });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setForm({
      brand: product.brand, name: product.name, sku: product.sku || '',
      category: product.category, subcategory: product.subcategory || '',
      gender: product.gender, ageGroup: product.ageGroup || '',
      oldPrice: product.oldPrice, newPrice: product.newPrice,
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes,
      color: product.color || '', description: product.description || '',
      images: Array.isArray(product.images) ? product.images.join(', ') : product.images || '',
      stock: product.stock || 10,
    });
    setEditingProduct(product);
    setShowForm(true);
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
    const productData = {
      ...form,
      oldPrice: parseInt(form.oldPrice), newPrice: parseInt(form.newPrice),
      discount: Math.round(((parseInt(form.oldPrice) - parseInt(form.newPrice)) / parseInt(form.oldPrice)) * 100),
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      stock: parseInt(form.stock), ageGroup: form.ageGroup || null,
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

  if (!authorized) return null;

  const brands = [...new Set(products.map(p => p.brand))].sort();
  const categories = [...new Set(products.map(p => p.category))].sort();

  let filtered = products;
  if (search) { const q = search.toLowerCase(); filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)); }
  if (filterBrand !== 'all') filtered = filtered.filter(p => p.brand === filterBrand);
  if (filterCategory !== 'all') filtered = filtered.filter(p => p.category === filterCategory);
  if (filterStock === 'low') filtered = filtered.filter(p => p.stock > 0 && p.stock <= 5);
  if (filterStock === 'out') filtered = filtered.filter(p => !p.inStock || p.stock === 0);
  if (filterStock === 'in') filtered = filtered.filter(p => p.inStock && p.stock > 5);

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
<a href="/admin/settings" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Settings</a>
            <button onClick={handleLogout} style={{background: 'transparent', color: '#FFF', border: '1px solid #444', fontSize: 11, fontWeight: 700, padding: '6px 14px', cursor: 'pointer'}}>Logout</button>
          </div>
        </div>

        <div style={{maxWidth: 1500, margin: '0 auto', padding: '24px'}}>
          {/* Add/Edit Form */}
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
                  <div><label style={LS}>Old Price (MKD) *</label><input required type="number" style={IS} value={form.oldPrice} onChange={(e) => setForm({...form, oldPrice: e.target.value})} /></div>
                  <div><label style={LS}>New Price (MKD) *</label><input required type="number" style={IS} value={form.newPrice} onChange={(e) => setForm({...form, newPrice: e.target.value})} /></div>
                  <div><label style={LS}>Sizes (comma) *</label><input required style={IS} value={form.sizes} onChange={(e) => setForm({...form, sizes: e.target.value})} placeholder="40, 41, 42" /></div>
                  <div><label style={LS}>Color</label><input style={IS} value={form.color} onChange={(e) => setForm({...form, color: e.target.value})} placeholder="Black/White" /></div>
                  <div><label style={LS}>Stock</label><input type="number" style={IS} value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} /></div>
                  <div><label style={LS}>Description</label><textarea rows={2} style={IS} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} /></div>
                  <div><label style={LS}>Images</label><input style={IS} value={form.images} onChange={(e) => setForm({...form, images: e.target.value})} placeholder="URLs (comma separated)" /><input type="file" accept="image/*" onChange={handleImageUpload} style={{marginTop: 6, fontSize: 11}} disabled={uploading} />{uploading && <span style={{fontSize: 10, color: '#999'}}>Uploading...</span>}</div>
                </div>
                <div style={{display: 'flex', gap: 10, marginTop: 20}}>
                  <button type="submit" style={{background: '#DC2626', color: '#FFF', border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '12px 28px', cursor: 'pointer'}}>{editingProduct ? 'Update' : 'Add Product'}</button>
                  <button type="button" onClick={resetForm} style={{background: 'transparent', color: '#000', border: '1px solid #E5E5E5', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '12px 28px', cursor: 'pointer'}}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Stats */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20}}>
            {[
              { label: 'Total', value: products.length },
              { label: 'In Stock', value: products.filter(p => p.inStock).length },
              { label: 'Low Stock', value: products.filter(p => p.stock > 0 && p.stock <= 5).length },
              { label: 'Out of Stock', value: products.filter(p => !p.inStock || p.stock === 0).length },
            ].map(s => (
              <div key={s.label} style={{background: '#FFF', padding: 14, border: '1px solid #F0F0F0', textAlign: 'center'}}>
                <p style={{fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 900, margin: '0 0 2px'}}>{s.value}</p>
                <p style={{color: '#999', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: 0}}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center'}}>
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} style={{flex: 1, minWidth: 180, padding: '8px 14px', border: '1px solid #E5E5E5', fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none'}} />
            <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} style={{padding: '8px 12px', border: '1px solid #E5E5E5', fontSize: 12, fontFamily: 'Inter, sans-serif', cursor: 'pointer'}}>
              <option value="all">All Brands</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{padding: '8px 12px', border: '1px solid #E5E5E5', fontSize: 12, fontFamily: 'Inter, sans-serif', cursor: 'pointer'}}>
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)} style={{padding: '8px 12px', border: '1px solid #E5E5E5', fontSize: 12, fontFamily: 'Inter, sans-serif', cursor: 'pointer'}}>
              <option value="all">All Stock</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
            <span style={{color: '#999', fontSize: 12, whiteSpace: 'nowrap'}}>{filtered.length} products</span>
          </div>

          {/* Table */}
          <div style={{background: '#FFF', padding: 20, border: '1px solid #F0F0F0', overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 900}}>
              <thead>
                <tr style={{borderBottom: '2px solid #000'}}>
                  <th style={th}>ID</th><th style={th}>Img</th><th style={th}>Product</th><th style={th}>SKU</th><th style={th}>Brand</th><th style={th}>Category</th><th style={th}>Gender</th><th style={th}>Old</th><th style={th}>New</th><th style={th}>%</th><th style={th}>Stock</th><th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{borderBottom: '1px solid #F0F0F0'}}>
                    <td style={td}>{p.id}</td>
                    <td style={td}>{p.images?.[0] && <img src={p.images[0]} alt="" style={{width: 36, height: 36, objectFit: 'contain', background: '#F5F5F5'}} />}</td>
                    <td style={{...td, fontWeight: 600}}>{p.name}</td>
                    <td style={{...td, color: '#999', fontSize: 10}}>{p.sku}</td>
                    <td style={{...td, color: '#DC2626', fontWeight: 600, fontSize: 10, textTransform: 'uppercase'}}>{p.brand}</td>
                    <td style={td}>{p.category}</td>
                    <td style={td}>{p.gender}</td>
                    <td style={td}>{p.oldPrice}</td>
                    <td style={{...td, fontWeight: 700}}>{p.newPrice}</td>
                    <td style={{...td, color: '#DC2626', fontWeight: 700}}>-{p.discount}%</td>
                    <td style={td}>
  <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
    <button onClick={async () => {
      await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id, stock: Math.max(0, (p.stock || 0) - 1), inStock: (p.stock || 0) - 1 > 0 }) });
      fetchProducts();
    }} style={{background: '#F5F5F5', border: '1px solid #E5E5E5', width: 22, height: 22, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 1}}>-</button>
    <span style={{color: (p.stock || 0) <= 5 ? '#DC2626' : '#16A34A', fontWeight: 700, minWidth: 20, textAlign: 'center'}}>{p.stock || 0}</span>
    <button onClick={async () => {
      await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id, stock: (p.stock || 0) + 1, inStock: true }) });
      fetchProducts();
    }} style={{background: '#F5F5F5', border: '1px solid #E5E5E5', width: 22, height: 22, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 1}}>+</button>
  </div>
</td>
                    <td style={td}>
                      <button onClick={() => handleEdit(p)} style={{background: '#000', color: '#FFF', border: 'none', padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', marginRight: 4}}>Edit</button>
                      <button onClick={() => handleDelete(p)} style={{background: '#DC2626', color: '#FFF', border: 'none', padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer'}}>Del</button>
                    </td>
                  </tr>
                ))}
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