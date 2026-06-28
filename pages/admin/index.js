import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    setAuthorized(true);
    fetchProducts();
    fetchOrders();
    const interval = setInterval(() => { fetchProducts(); fetchOrders(); }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => { const r = await fetch('/api/admin/products'); setProducts(await r.json()); };
  const fetchOrders = async () => { const r = await fetch('/api/orders'); setOrders(await r.json()); };
  const updateOrderStatus = async (id, status) => { await fetch('/api/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) }); fetchOrders(); };
  const handleLogout = () => { localStorage.removeItem('admin_token'); router.push('/admin/login'); };
  if (!authorized) return null;

  const totalProducts = products.length;
  const inStock = products.filter(p => p.inStock).length;
  const lowStock = products.filter(p => p.inStock && p.sizes && p.sizes.some(s => s.stock > 0 && s.stock <= 3));
  const outOfStock = products.filter(p => !p.inStock || !p.sizes || p.sizes.every(s => (s.stock || 0) === 0));
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const todayOrders = orders.filter(o => new Date(o.createdAt || o.created_at).toDateString() === new Date().toDateString());
  const todayRevenue = todayOrders.reduce((s, o) => s + (o.total || 0), 0);
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalCustomers = [...new Set(orders.map(o => o.customer_phone || o.customerInfo?.phone || o.customer_email || o.customerInfo?.email))].filter(Boolean).length;

  const displayOrders = activeTab === 'overview' ? orders.slice(0, 10) : orders.filter(o => o.status === activeTab);
  const statusBg = (s) => s === 'shipped' ? '#F0FDF4' : s === 'delivered' ? '#EFF6FF' : '#FFF7ED';
  const statusColor = (s) => s === 'shipped' ? '#16A34A' : s === 'delivered' ? '#2563EB' : '#EA580C';

  return (
    <>
      <Head><title>Dashboard | OUTLETX Admin</title></Head>
      <div style={{minHeight:'100vh',background:'#F8F8F8',fontFamily:'Inter, sans-serif'}}>
        <div style={{background:'#FFF',borderBottom:'1px solid #EEE',padding:'0 32px',height:60,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:32}}>
            <h1 style={{fontFamily:'Montserrat, sans-serif',fontSize:16,fontWeight:900,letterSpacing:-0.5,margin:0}}>OUTLET<span style={{color:'#DC2626'}}>X</span></h1>
            <nav style={{display:'flex',gap:24}}>
              <a href="/admin" style={{color:'#000',textDecoration:'none',fontSize:12,fontWeight:700}}>Dashboard</a>
              <a href="/admin/products" style={{color:'#888',textDecoration:'none',fontSize:12,fontWeight:600}}>Products</a>
              <a href="/admin/orders" style={{color:'#888',textDecoration:'none',fontSize:12,fontWeight:600}}>Orders</a>
              <a href="/admin/customers" style={{color:'#888',textDecoration:'none',fontSize:12,fontWeight:600}}>Customers</a>
              <a href="/admin/settings" style={{color:'#888',textDecoration:'none',fontSize:12,fontWeight:600}}>Settings</a>
            </nav>
          </div>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <a href="/" target="_blank" style={{color:'#888',textDecoration:'none',fontSize:11,fontWeight:600}}>View Site →</a>
            <button onClick={handleLogout} style={{background:'#000',color:'#FFF',border:'none',fontSize:10,fontWeight:700,letterSpacing:1,textTransform:'uppercase',padding:'7px 14px',cursor:'pointer',fontFamily:'Inter, sans-serif',borderRadius:2}}>Logout</button>
          </div>
        </div>

        <div style={{maxWidth:1400,margin:'0 auto',padding:'28px 24px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:12,marginBottom:28}}>
            {[{l:'Products',v:totalProducts,c:'#000'},{l:'In Stock',v:inStock,c:'#16A34A'},{l:'Low Stock',v:lowStock.length,c:'#EA580C',a:lowStock.length>0},{l:'Out of Stock',v:outOfStock.length,c:'#DC2626',a:outOfStock.length>0},{l:'Total Orders',v:orders.length,c:'#2563EB'},{l:'Pending',v:pendingOrders.length,c:'#EA580C',a:pendingOrders.length>0},{l:'Today Revenue',v:todayRevenue.toLocaleString()+' MKD',c:'#16A34A'},{l:'Total Revenue',v:totalRevenue.toLocaleString()+' MKD',c:'#000'},{l:'Customers',v:totalCustomers,c:'#000'}].map(s=>(<div key={s.l} style={{background:s.a?'#FFF7ED':'#FFF',padding:'16px 18px',borderRadius:2,border:'1px solid #F0F0F0',borderLeft:`3px solid ${s.c}`}}><p style={{fontFamily:'Montserrat, sans-serif',fontSize:26,fontWeight:900,margin:'0 0 4px',color:s.c}}>{s.v}</p><p style={{color:'#999',fontSize:10,fontWeight:700,letterSpacing:1,textTransform:'uppercase',margin:0}}>{s.l}</p></div>))}
          </div>

          {lowStock.length>0&&(<div style={{background:'#FFF7ED',border:'1px solid #FED7AA',padding:18,borderRadius:2,marginBottom:24}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><div><h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:13,fontWeight:900,color:'#EA580C',margin:0}}>Low Stock Alert ({lowStock.length})</h2><p style={{color:'#9A3412',fontSize:11,margin:'2px 0 0'}}>Restock needed</p></div><a href="/admin/products" style={{color:'#EA580C',textDecoration:'none',fontSize:11,fontWeight:700}}>Manage →</a></div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:8}}>{lowStock.map(p=><div key={p.id} style={{background:'#FFF',padding:12,borderRadius:2,display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><p style={{fontWeight:700,fontSize:11,textTransform:'uppercase',margin:'0 0 2px'}}>{p.name}</p><p style={{color:'#DC2626',fontSize:10,fontWeight:700,textTransform:'uppercase',margin:0}}>{p.brand}</p></div><span style={{background:'#FEF2F2',color:'#DC2626',fontWeight:900,fontSize:20,padding:'6px 14px',borderRadius:2}}>{p.sizes.reduce((s,x)=>s+(x.stock||0),0)}</span></div>)}</div></div>)}

          <div style={{background:'#FFF',border:'1px solid #F0F0F0',borderRadius:2,overflow:'hidden'}}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid #F0F0F0',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
              <div style={{display:'flex',gap:0}}>{['overview','pending','shipped','delivered'].map(tab=><button key={tab} onClick={()=>setActiveTab(tab)} style={{padding:'7px 16px',cursor:'pointer',fontWeight:700,fontSize:10,letterSpacing:1,textTransform:'uppercase',background:'none',border:'none',color:activeTab===tab?'#DC2626':'#999',borderBottom:activeTab===tab?'2px solid #DC2626':'2px solid transparent',fontFamily:'Inter, sans-serif'}}>{tab}</button>)}</div>
              <a href="/admin/orders" style={{color:'#000',textDecoration:'none',fontSize:11,fontWeight:700}}>View All →</a>
            </div>
            {displayOrders.length===0?<p style={{color:'#999',fontSize:12,textAlign:'center',padding:40,margin:0}}>No orders</p>:displayOrders.map(o=>(<div key={o.id} style={{padding:'12px 20px',borderBottom:'1px solid #F5F5F5',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}><span style={{fontWeight:700,fontSize:12,minWidth:70}}>#{String(o.id).slice(-6)}</span><span style={{color:'#999',fontSize:10,minWidth:80}}>{new Date(o.createdAt||o.created_at).toLocaleDateString()}</span><span style={{fontWeight:600,fontSize:12,flex:1,minWidth:100}}>{o.customer_name||o.customerInfo?.fullName||'Unknown'}</span><span style={{fontSize:11,minWidth:120}}>{o.product_name||o.product?.name||'-'}</span><span style={{fontWeight:700,fontSize:12,minWidth:70}}>{o.total||0} MKD</span><span style={{background:statusBg(o.status),color:statusColor(o.status),padding:'2px 8px',fontSize:9,fontWeight:700,textTransform:'uppercase',borderRadius:2}}>{o.status||'Pending'}</span>{o.status==='pending'&&<button onClick={()=>updateOrderStatus(o.id,'shipped')} style={{background:'#000',color:'#FFF',border:'none',padding:'4px 12px',fontSize:9,fontWeight:700,cursor:'pointer',borderRadius:2}}>Ship</button>}{o.status==='shipped'&&<button onClick={()=>updateOrderStatus(o.id,'delivered')} style={{background:'#2563EB',color:'#FFF',border:'none',padding:'4px 12px',fontSize:9,fontWeight:700,cursor:'pointer',borderRadius:2}}>Deliver</button>}</div>))}
          </div>
        </div>
      </div>
    </>
  );
}