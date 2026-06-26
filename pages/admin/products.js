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
  const [expandedProduct, setExpandedProduct] = useState(null);
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
    setEditingProduct(null); setShowForm(false);
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
    setEditingProduct(product); setShowForm(true);
  };

  const addSizeRow = () => setForm({ ...form, sizes: [...form.sizes, { size: '', stock: 1 }] });
  const removeSizeRow = (i) => setForm({ ...form, sizes: form.sizes.filter((_, idx) => idx !== i) });
  const updateSize = (i, field, value) => { const u = [...form.sizes]; u[i][field] = field === 'stock' ? parseInt(value) || 0 : value; setForm({ ...form, sizes: u }); };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true); const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) setForm(p => ({ ...p, images: p.images ? `${p.images}, ${data.url}` : data.url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validSizes = form.sizes.filter(s => s.size);
    const totalStock = validSizes.reduce((sum, s) => sum + (s.stock || 0), 0);
    const pd = { ...form, oldPrice: parseInt(form.oldPrice), newPrice: parseInt(form.newPrice), discount: Math.round(((parseInt(form.oldPrice) - parseInt(form.newPrice)) / parseInt(form.oldPrice)) * 100), sizes: validSizes, images: form.images.split(',').map(s => s.trim()).filter(Boolean), ageGroup: form.ageGroup || null, inStock: totalStock > 0 };
    if (editingProduct) await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingProduct.id, ...pd }) });
    else await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pd) });
    resetForm(); fetchProducts();
  };

  const handleDelete = async (p) => { if (!confirm(`Delete "${p.name}"?`)) return; await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id }) }); fetchProducts(); };

  const updateSizeStock = async (p, si, d) => {
    const us = [...p.sizes]; us[si] = { ...us[si], stock: Math.max(0, (us[si].stock || 0) + d) };
    const ts = us.reduce((s, x) => s + (x.stock || 0), 0);
    await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id, sizes: us, inStock: ts > 0 }) });
    fetchProducts();
  };

  if (!authorized) return null;

  const brands = [...new Set(products.map(p => p.brand))].sort();
  const cats = [...new Set(products.map(p => p.category))].sort();
  let filtered = products;
  if (search) { const q = search.toLowerCase(); filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)); }
  if (filterBrand !== 'all') filtered = filtered.filter(p => p.brand === filterBrand);
  if (filterCategory !== 'all') filtered = filtered.filter(p => p.category === filterCategory);
  if (filterStock === 'low') filtered = filtered.filter(p => p.inStock && p.sizes && p.sizes.some(s => s.stock > 0 && s.stock <= 3));
  if (filterStock === 'out') filtered = filtered.filter(p => !p.inStock || !p.sizes || p.sizes.every(s => (s.stock || 0) === 0));
  if (filterStock === 'in') filtered = filtered.filter(p => p.inStock && p.sizes && p.sizes.some(s => s.stock > 3));

  return (
    <>
      <Head><title>Products | OUTLETX Admin</title></Head>
      <div style={{minHeight:'100vh',background:'#F8F8F8',fontFamily:'Inter, sans-serif'}}>
        <div style={{background:'#FFF',borderBottom:'1px solid #EEE',padding:'0 32px',height:60,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:32}}>
            <h1 style={{fontFamily:'Montserrat, sans-serif',fontSize:16,fontWeight:900,letterSpacing:-0.5,margin:0}}>OUTLET<span style={{color:'#DC2626'}}>X</span></h1>
            <nav style={{display:'flex',gap:24}}>
              <a href="/admin" style={{color:'#888',textDecoration:'none',fontSize:12,fontWeight:600}}>Dashboard</a>
              <a href="/admin/products" style={{color:'#000',textDecoration:'none',fontSize:12,fontWeight:700}}>Products</a>
              <a href="/admin/orders" style={{color:'#888',textDecoration:'none',fontSize:12,fontWeight:600}}>Orders</a>
              <a href="/admin/customers" style={{color:'#888',textDecoration:'none',fontSize:12,fontWeight:600}}>Customers</a>
              <a href="/admin/settings" style={{color:'#888',textDecoration:'none',fontSize:12,fontWeight:600}}>Settings</a>
            </nav>
          </div>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <button onClick={()=>{resetForm();setShowForm(true)}} style={{background:'#DC2626',color:'#FFF',border:'none',fontSize:10,fontWeight:700,letterSpacing:1,textTransform:'uppercase',padding:'7px 14px',cursor:'pointer',fontFamily:'Inter, sans-serif',borderRadius:2}}>+ Add Product</button>
            <button onClick={handleLogout} style={{background:'#000',color:'#FFF',border:'none',fontSize:10,fontWeight:700,letterSpacing:1,textTransform:'uppercase',padding:'7px 14px',cursor:'pointer',fontFamily:'Inter, sans-serif',borderRadius:2}}>Logout</button>
          </div>
        </div>

        <div style={{maxWidth:1400,margin:'0 auto',padding:'28px 24px'}}>
          {showForm && (
            <div style={{background:'#FFF',padding:28,marginBottom:24,border:'1px solid #F0F0F0',borderRadius:2}}>
              <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:15,fontWeight:900,letterSpacing:-0.5,textTransform:'uppercase',marginBottom:20}}>{editingProduct?'Edit Product':'Add New Product'}</h2>
              <form onSubmit={handleSubmit}>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
                  {[{l:'Brand *',v:form.brand,f:'brand',ph:'Nike'},{l:'Name *',v:form.name,f:'name',ph:'Air Max 90'},{l:'SKU *',v:form.sku,f:'sku',ph:'DM0029-101'}].map(f=> <div key={f.f}><label style={L}>{f.l}</label><input required style={I} value={f.v} onChange={e=>setForm({...form,[f.f]:e.target.value})} placeholder={f.ph}/></div>)}
                  <div><label style={L}>Category *</label><select required style={I} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option value="">Select...</option><option>Shoes</option><option>Shirts</option><option>Hoodies</option><option>Jackets</option><option>Pants</option><option>Shorts</option><option>Swimwear</option><option>Accessories</option></select></div>
                  <div><label style={L}>Subcategory</label><input style={I} value={form.subcategory} onChange={e=>setForm({...form,subcategory:e.target.value})} placeholder="Running"/></div>
                  <div><label style={L}>Gender *</label><select required style={I} value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option>Men</option><option>Women</option><option>Kids</option><option>Unisex</option></select></div>
                  <div><label style={L}>Age Group</label><select style={I} value={form.ageGroup} onChange={e=>setForm({...form,ageGroup:e.target.value})}><option value="">None</option><option value="0-3">0-3</option><option value="4-8">4-8</option><option value="9-14">9-14</option></select></div>
                  <div><label style={L}>Featured</label><select style={I} value={form.featured?'yes':'no'} onChange={e=>setForm({...form,featured:e.target.value==='yes'})}><option value="no">No</option><option value="yes">Yes — Homepage</option></select></div>
                  <div><label style={L}>Old Price (MKD)*</label><input required type="number" style={I} value={form.oldPrice} onChange={e=>setForm({...form,oldPrice:e.target.value})}/></div>
                  <div><label style={L}>New Price (MKD)*</label><input required type="number" style={I} value={form.newPrice} onChange={e=>setForm({...form,newPrice:e.target.value})}/></div>
                  <div><label style={L}>Color</label><input style={I} value={form.color} onChange={e=>setForm({...form,color:e.target.value})} placeholder="Black/White"/></div>
                  <div><label style={L}>Description</label><textarea rows={2} style={I} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
                  <div><label style={L}>Images</label><input style={I} value={form.images} onChange={e=>setForm({...form,images:e.target.value})} placeholder="URLs"/><input type="file" accept="image/*" onChange={handleImageUpload} style={{marginTop:6,fontSize:11}} disabled={uploading}/>{uploading&&<span style={{fontSize:10,color:'#999'}}>Uploading...</span>}</div>
                </div>
                <div style={{marginTop:20}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><label style={{...L,marginBottom:0}}>Sizes & Stock *</label><button type="button" onClick={addSizeRow} style={{background:'#000',color:'#FFF',border:'none',fontSize:10,fontWeight:700,padding:'5px 12px',cursor:'pointer',borderRadius:2}}>+ Add Size</button></div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:6}}>
                    {form.sizes.map((s,i)=> <div key={i} style={{display:'flex',gap:4,alignItems:'center'}}><input required style={{...I,width:55}} value={s.size} onChange={e=>updateSize(i,'size',e.target.value)} placeholder="42"/><input type="number" min="0" style={{...I,width:45}} value={s.stock} onChange={e=>updateSize(i,'stock',e.target.value)} placeholder="Qty"/>{form.sizes.length>1&&<button type="button" onClick={()=>removeSizeRow(i)} style={{background:'#DC2626',color:'#FFF',border:'none',fontSize:14,cursor:'pointer',width:22,height:22,lineHeight:1,borderRadius:2}}>&times;</button>}</div>)}
                  </div>
                  <p style={{fontSize:10,color:'#999',marginTop:6}}>Total: {form.sizes.reduce((s,x)=>s+(parseInt(x.stock)||0),0)}</p>
                </div>
                <div style={{display:'flex',gap:10,marginTop:20}}>
                  <button type="submit" style={{background:'#DC2626',color:'#FFF',border:'none',fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',padding:'10px 24px',cursor:'pointer',borderRadius:2}}>{editingProduct?'Update':'Add Product'}</button>
                  <button type="button" onClick={resetForm} style={{background:'#FFF',color:'#000',border:'1px solid #E5E5E5',fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',padding:'10px 24px',cursor:'pointer',borderRadius:2}}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,marginBottom:24}}>
            {[{l:'Total',v:products.length},{l:'In Stock',v:products.filter(p=>p.inStock).length},{l:'Low Stock',v:products.filter(p=>p.inStock&&p.sizes&&p.sizes.some(s=>s.stock>0&&s.stock<=3)).length},{l:'Out',v:products.filter(p=>!p.inStock||!p.sizes||p.sizes.every(s=>(s.stock||0)===0)).length}].map(s=><div key={s.l} style={{background:'#FFF',padding:'14px 16px',border:'1px solid #F0F0F0',borderRadius:2,textAlign:'center'}}><p style={{fontFamily:'Montserrat, sans-serif',fontSize:22,fontWeight:900,margin:'0 0 2px'}}>{s.v}</p><p style={{color:'#999',fontSize:9,fontWeight:700,letterSpacing:1,textTransform:'uppercase',margin:0}}>{s.l}</p></div>)}
          </div>

          <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
            <input type="text" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:160,padding:'7px 14px',border:'1px solid #E5E5E5',fontSize:12,fontFamily:'Inter, sans-serif',outline:'none',borderRadius:2,background:'#FFF'}}/>
            <select value={filterBrand} onChange={e=>setFilterBrand(e.target.value)} style={S}><option value="all">All Brands</option>{brands.map(b=><option key={b} value={b}>{b}</option>)}</select>
            <select value={filterCategory} onChange={e=>setFilterCategory(e.target.value)} style={S}><option value="all">All Categories</option>{cats.map(c=><option key={c} value={c}>{c}</option>)}</select>
            <select value={filterStock} onChange={e=>setFilterStock(e.target.value)} style={S}><option value="all">All Stock</option><option value="in">In Stock</option><option value="low">Low Stock</option><option value="out">Out</option></select>
            <span style={{color:'#999',fontSize:11,whiteSpace:'nowrap'}}>{filtered.length} products</span>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {filtered.map(p=>{const ts=p.sizes?p.sizes.reduce((s,x)=>s+(x.stock||0),0):0;return(
              <div key={p.id} style={{background:'#FFF',border:'1px solid #F0F0F0',borderRadius:2,overflow:'hidden'}}>
                <div style={{display:'flex',alignItems:'center',padding:'12px 18px',cursor:'pointer',gap:14,flexWrap:'wrap'}} onClick={()=>setExpandedProduct(expandedProduct===p.id?null:p.id)}>
                  {p.images?.[0]&&<img src={p.images[0]} alt="" style={{width:36,height:36,objectFit:'contain',background:'#F5F5F5',borderRadius:2}}/>}
                  <span style={{fontWeight:700,fontSize:12,textTransform:'uppercase',flex:1,minWidth:140}}>{p.name}</span>
                  <span style={{color:'#DC2626',fontWeight:700,fontSize:10,textTransform:'uppercase',minWidth:60}}>{p.brand}</span>
                  <span style={{color:'#999',fontSize:10,minWidth:80}}>{p.sku}</span>
                  <span style={{fontWeight:700,fontSize:12,minWidth:70}}>{p.newPrice} MKD</span>
                  <span style={{color:p.featured?'#DC2626':'#CCC',fontSize:10,fontWeight:700,minWidth:20}}>{p.featured?'★':'☆'}</span>
                  <span style={{color:ts<=5&&ts>0?'#DC2626':ts===0?'#CCC':'#16A34A',fontWeight:700,fontSize:12,minWidth:40}}>{ts}</span>
                  <span style={{color:'#CCC',fontSize:14}}>{expandedProduct===p.id?'▾':'▸'}</span>
                </div>
                {expandedProduct===p.id&&(
                  <div style={{borderTop:'1px solid #F0F0F0',padding:'14px 18px',background:'#FAFAFA'}}>
                    <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:12}}>
                      {p.sizes&&p.sizes.map((s,i)=><span key={i} style={{background:(s.stock||0)<=2?'#FEF2F2':'#F5F5F5',color:(s.stock||0)<=2?'#DC2626':'#000',padding:'4px 10px',fontSize:10,fontWeight:600,borderRadius:2,display:'inline-flex',alignItems:'center',gap:5}}>{s.size}: {s.stock||0}<button onClick={(e)=>{e.stopPropagation();updateSizeStock(p,i,-1)}} style={{background:'none',border:'none',cursor:'pointer',fontSize:12,padding:0,color:'#999'}}>-</button><button onClick={(e)=>{e.stopPropagation();updateSizeStock(p,i,1)}} style={{background:'none',border:'none',cursor:'pointer',fontSize:12,padding:0,color:'#999'}}>+</button></span>)}
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      <button onClick={(e)=>{e.stopPropagation();handleEdit(p)}} style={{background:'#000',color:'#FFF',border:'none',padding:'5px 14px',fontSize:10,fontWeight:700,cursor:'pointer',borderRadius:2}}>Edit</button>
                      <button onClick={(e)=>{e.stopPropagation();handleDelete(p)}} style={{background:'#DC2626',color:'#FFF',border:'none',padding:'5px 14px',fontSize:10,fontWeight:700,cursor:'pointer',borderRadius:2}}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            )})}
          </div>
        </div>
      </div>
    </>
  );
}

const I = { width:'100%',padding:9,border:'1px solid #E5E5E5',fontSize:11,fontFamily:'Inter, sans-serif',outline:'none',boxSizing:'border-box',borderRadius:2 };
const L = { display:'block',fontWeight:700,fontSize:9,letterSpacing:1,textTransform:'uppercase',color:'#999',marginBottom:4 };
const S = { padding:'7px 12px',border:'1px solid #E5E5E5',fontSize:11,fontFamily:'Inter, sans-serif',cursor:'pointer',borderRadius:2,background:'#FFF' };
