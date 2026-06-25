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

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

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
    if (data.url) {
      setForm(prev => ({ ...prev, images: prev.images ? `${prev.images}, ${data.url}` : data.url }));
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...form,
      oldPrice: parseInt(form.oldPrice),
      newPrice: parseInt(form.newPrice),
      discount: Math.round(((parseInt(form.oldPrice) - parseInt(form.newPrice)) / parseInt(form.oldPrice)) * 100),
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      stock: parseInt(form.stock),
      ageGroup: form.ageGroup || null,
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

  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #E5E5E5', fontSize: '13px', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontWeight: '700', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: '#999999', marginBottom: '6px' };

  return (
    <>
      <Head><title>Products | OUTLETX Admin</title></Head>
      <div style={{minHeight: '100vh', background: '#F5F5F5', fontFamily: 'Inter, sans-serif'}}>
        <div style={{background: '#000000', color: '#FFFFFF', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '900', margin: 0}}>
            OUTLET<span style={{color: '#DC2626'}}>X</span> <span style={{color: '#888888', fontSize: '14px', fontWeight: '400'}}>Products</span>
          </h1>
          <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <button onClick={() => { resetForm(); setShowForm(true); }} style={{background: '#DC2626', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: '700', padding: '10px 20px', cursor: 'pointer'}}>+ Add Product</button>
            <a href="/admin" style={{color: '#FFFFFF', textDecoration: 'none', fontSize: '13px', fontWeight: '600'}}>Dashboard</a>
            <a href="/admin/orders" style={{color: '#FFFFFF', textDecoration: 'none', fontSize: '13px', fontWeight: '600'}}>Orders</a>
            <button onClick={handleLogout} style={{background: 'transparent', color: '#FFFFFF', border: '1px solid #444', fontSize: '12px', fontWeight: '700', padding: '8px 16px', cursor: 'pointer'}}>Logout</button>
          </div>
        </div>

        <div style={{maxWidth: '1400px', margin: '40px auto', padding: '0 40px'}}>
          {showForm && (
            <div style={{background: '#FFFFFF', padding: '32px', marginBottom: '32px'}}>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '24px'}}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
                  <div><label style={labelStyle}>Brand *</label><input required style={inputStyle} value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value})} placeholder="Nike" /></div>
                  <div><label style={labelStyle}>Product Name *</label><input required style={inputStyle} value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Air Max 90" /></div>
                  <div><label style={labelStyle}>SKU / Code *</label><input required style={inputStyle} value={form.sku} onChange={(e) => setForm({...form, sku: e.target.value})} placeholder="DM0029-101" /></div>
                  <div><label style={labelStyle}>Category *</label>
                    <select required style={inputStyle} value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                      <option value="">Select...</option>
                      <option>Shoes</option><option>Shirts</option><option>Hoodies</option>
                      <option>Jackets</option><option>Pants</option><option>Shorts</option>
                      <option>Swimwear</option><option>Accessories</option>
                    </select>
                  </div>
                  <div><label style={labelStyle}>Subcategory</label><input style={inputStyle} value={form.subcategory} onChange={(e) => setForm({...form, subcategory: e.target.value})} placeholder="Running, Lifestyle..." /></div>
                  <div><label style={labelStyle}>Gender *</label>
                    <select required style={inputStyle} value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value})}>
                      <option>Men</option><option>Women</option><option>Kids</option><option>Unisex</option>
                    </select>
                  </div>
                  <div><label style={labelStyle}>Age Group (Kids)</label>
                    <select style={inputStyle} value={form.ageGroup} onChange={(e) => setForm({...form, ageGroup: e.target.value})}>
                      <option value="">None</option><option value="0-3">0-3</option><option value="4-8">4-8</option><option value="9-14">9-14</option>
                    </select>
                  </div>
                  <div><label style={labelStyle}>Old Price (MKD) *</label><input required type="number" style={inputStyle} value={form.oldPrice} onChange={(e) => setForm({...form, oldPrice: e.target.value})} /></div>
                  <div><label style={labelStyle}>New Price (MKD) *</label><input required type="number" style={inputStyle} value={form.newPrice} onChange={(e) => setForm({...form, newPrice: e.target.value})} /></div>
                  <div><label style={labelStyle}>Sizes (comma separated) *</label><input required style={inputStyle} value={form.sizes} onChange={(e) => setForm({...form, sizes: e.target.value})} placeholder="40, 41, 42, 43" /></div>
                  <div><label style={labelStyle}>Color</label><input style={inputStyle} value={form.color} onChange={(e) => setForm({...form, color: e.target.value})} placeholder="Black/White" /></div>
                  <div><label style={labelStyle}>Stock</label><input type="number" style={inputStyle} value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} /></div>
                  <div><label style={labelStyle}>Description</label><textarea rows="2" style={inputStyle} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} /></div>
                  <div><label style={labelStyle}>Images (URLs or upload)</label>
                    <input style={inputStyle} value={form.images} onChange={(e) => setForm({...form, images: e.target.value})} placeholder="Image URLs (comma separated)" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{marginTop: '8px', fontSize: '12px'}} disabled={uploading} />
                    {uploading && <span style={{fontSize: '11px', color: '#999'}}>Uploading...</span>}
                  </div>
                </div>
                <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
                  <button type="submit" style={{background: '#DC2626', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', padding: '14px 32px', cursor: 'pointer'}}>
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button type="button" onClick={resetForm} style={{background: 'transparent', color: '#000000', border: '1px solid #E5E5E5', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', padding: '14px 32px', cursor: 'pointer'}}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div style={{background: '#FFFFFF', padding: '24px'}}>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '20px'}}>All Products ({products.length})</h2>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '900px'}}>
                <thead>
                  <tr style={{borderBottom: '2px solid #000000'}}>
                    <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>ID</th>
                    <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Image</th>
                    <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Product</th>
                    <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>SKU</th>
                    <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Brand</th>
                    <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Price</th>
                    <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Stock</th>
                    <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{borderBottom: '1px solid #F0F0F0'}}>
                      <td style={{padding: '10px 8px'}}>{p.id}</td>
                      <td style={{padding: '10px 8px'}}>
                        {p.images?.[0] && <img src={p.images[0]} alt="" style={{width: '40px', height: '40px', objectFit: 'contain', background: '#F5F5F5'}} />}
                      </td>
                      <td style={{padding: '10px 8px', fontWeight: '600'}}>{p.name}</td>
                      <td style={{padding: '10px 8px', color: '#999', fontSize: '11px'}}>{p.sku}</td>
                      <td style={{padding: '10px 8px', color: '#DC2626', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase'}}>{p.brand}</td>
                      <td style={{padding: '10px 8px', fontWeight: '700'}}>{p.newPrice} MKD</td>
                      <td style={{padding: '10px 8px'}}>
                        <span style={{color: (p.stock || 0) <= 5 ? '#DC2626' : '#16A34A', fontWeight: '700'}}>{p.stock || 0}</span>
                      </td>
                      <td style={{padding: '10px 8px'}}>
                        <button onClick={() => handleEdit(p)} style={{background: '#000000', color: '#FFF', border: 'none', padding: '6px 12px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', marginRight: '6px'}}>Edit</button>
                        <button onClick={() => handleDelete(p)} style={{background: '#DC2626', color: '#FFF', border: 'none', padding: '6px 12px', fontSize: '11px', fontWeight: '700', cursor: 'pointer'}}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
