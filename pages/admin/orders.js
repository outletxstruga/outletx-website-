import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminOrders() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    setAuthorized(true);
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data || []);
  };

  const updateStatus = async (orderId, status) => {
    await fetch('/api/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId, status }) });
    fetchOrders();
  };

  const handleLogout = () => { localStorage.removeItem('admin_token'); router.push('/admin/login'); };
  if (!authorized) return null;

  let filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  if (search) {
    const q = search.toLowerCase();
    filteredOrders = filteredOrders.filter(o => 
      (o.customer_name || o.customerInfo?.fullName || '').toLowerCase().includes(q) ||
      (o.customer_phone || o.customerInfo?.phone || '').toLowerCase().includes(q) ||
      (o.product_name || o.product?.name || '').toLowerCase().includes(q) ||
      String(o.id).includes(q)
    );
  }

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const shippedCount = orders.filter(o => o.status === 'shipped').length;
  const todayCount = orders.filter(o => new Date(o.createdAt || o.created_at).toDateString() === new Date().toDateString()).length;
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  const statusColor = (s) => s === 'shipped' ? '#16A34A' : s === 'delivered' ? '#2563EB' : '#EA580C';
  const statusBg = (s) => s === 'shipped' ? '#F0FDF4' : s === 'delivered' ? '#EFF6FF' : '#FFF7ED';

  const exportCSV = () => {
    const headers = ['Order ID','Date','Customer','Phone','Email','City','Address','Product','SKU','Size','Qty','Total','Card','Status'];
    const rows = filteredOrders.map(o => [o.id,new Date(o.createdAt||o.created_at).toLocaleDateString(),o.customer_name||o.customerInfo?.fullName||'',o.customer_phone||o.customerInfo?.phone||'',o.customer_email||o.customerInfo?.email||'',o.customer_city||o.customerInfo?.city||'',o.customer_address||o.customerInfo?.address||'',o.product_name||o.product?.name||'',o.product_sku||o.product?.sku||'',o.size||'',o.quantity||1,o.total||0,o.card_last4||o.cardLast4||'',o.status||'pending']);
    const csv = [headers,...rows].map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`outletx_orders_${new Date().toISOString().split('T')[0]}.csv`;a.click();
  };

  return (
    <>
      <Head><title>Orders | OUTLETX Admin</title></Head>
      <div style={{minHeight:'100vh',background:'#F8F8F8',fontFamily:'Inter, sans-serif'}}>
        {/* Header */}
        <div style={{background:'#FFF',borderBottom:'1px solid #EEE',padding:'0 32px',height:60,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:32}}>
            <h1 style={{fontFamily:'Montserrat, sans-serif',fontSize:16,fontWeight:900,letterSpacing:-0.5,margin:0}}>OUTLET<span style={{color:'#DC2626'}}>X</span></h1>
            <nav style={{display:'flex',gap:24}}>
              <a href="/admin" style={{color:'#888',textDecoration:'none',fontSize:12,fontWeight:600}}>Dashboard</a>
              <a href="/admin/products" style={{color:'#888',textDecoration:'none',fontSize:12,fontWeight:600}}>Products</a>
              <a href="/admin/orders" style={{color:'#000',textDecoration:'none',fontSize:12,fontWeight:700}}>Orders</a>
              <a href="/admin/customers" style={{color:'#888',textDecoration:'none',fontSize:12,fontWeight:600}}>Customers</a>
              <a href="/admin/settings" style={{color:'#888',textDecoration:'none',fontSize:12,fontWeight:600}}>Settings</a>
            </nav>
          </div>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <button onClick={exportCSV} style={{background:'#FFF',color:'#000',border:'1px solid #E5E5E5',fontSize:10,fontWeight:700,letterSpacing:1,textTransform:'uppercase',padding:'7px 14px',cursor:'pointer',fontFamily:'Inter, sans-serif'}}>Export CSV</button>
            <button onClick={handleLogout} style={{background:'#000',color:'#FFF',border:'none',fontSize:10,fontWeight:700,letterSpacing:1,textTransform:'uppercase',padding:'7px 14px',cursor:'pointer',fontFamily:'Inter, sans-serif'}}>Logout</button>
          </div>
        </div>

        <div style={{maxWidth:1400,margin:'0 auto',padding:'28px 24px'}}>
          {/* Stats Cards */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:28}}>
            {[
              {label:'Total Orders',value:orders.length,color:'#000'},
              {label:'Pending',value:pendingCount,color:'#EA580C'},
              {label:'Shipped',value:shippedCount,color:'#16A34A'},
              {label:'Today',value:todayCount,color:'#2563EB'},
              {label:'Revenue',value:totalRevenue.toLocaleString()+' MKD',color:'#16A34A'},
            ].map(s=>(
              <div key={s.label} style={{background:'#FFF',padding:'16px 20px',borderRadius:2,border:'1px solid #F0F0F0'}}>
                <p style={{fontFamily:'Montserrat, sans-serif',fontSize:28,fontWeight:900,margin:'0 0 4px',color:s.color}}>{s.value}</p>
                <p style={{color:'#999',fontSize:10,fontWeight:700,letterSpacing:1,textTransform:'uppercase',margin:0}}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
            {['all','pending','shipped','delivered'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{
                padding:'7px 18px',cursor:'pointer',fontWeight:700,fontSize:10,letterSpacing:1,textTransform:'uppercase',
                background:filter===f?'#000':'#FFF',color:filter===f?'#FFF':'#999',
                border:'1px solid #E5E5E5',fontFamily:'Inter, sans-serif',borderRadius:2,transition:'all 0.2s'
              }}>{f}</button>
            ))}
            <input type="text" placeholder="Search orders..." value={search} onChange={e=>setSearch(e.target.value)} style={{
              flex:1,minWidth:180,padding:'7px 14px',border:'1px solid #E5E5E5',fontSize:12,fontFamily:'Inter, sans-serif',outline:'none',borderRadius:2,background:'#FFF'
            }} />
            <span style={{color:'#999',fontSize:11,whiteSpace:'nowrap'}}>{filteredOrders.length} orders</span>
          </div>

          {/* Orders List */}
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {filteredOrders.length===0?(
              <div style={{background:'#FFF',padding:60,textAlign:'center',border:'1px solid #F0F0F0',borderRadius:2}}>
                <p style={{color:'#999',fontSize:13,margin:0}}>No orders found</p>
              </div>
            ):filteredOrders.map(o=>(
              <div key={o.id} style={{background:'#FFF',border:'1px solid #F0F0F0',borderRadius:2,overflow:'hidden'}}>
                {/* Order Row */}
                <div style={{display:'flex',alignItems:'center',padding:'14px 20px',cursor:'pointer',gap:16,flexWrap:'wrap'}}
                  onClick={()=>setSelectedOrder(selectedOrder?.id===o.id?null:o)}>
                  <span style={{fontWeight:700,fontSize:13,minWidth:80}}>#{String(o.id).slice(-6)}</span>
                  <span style={{color:'#999',fontSize:11,minWidth:90}}>{new Date(o.createdAt||o.created_at).toLocaleDateString()}</span>
                  <span style={{fontWeight:600,fontSize:13,flex:1,minWidth:120}}>{o.customer_name||o.customerInfo?.fullName||'Unknown'}</span>
                  <span style={{fontSize:12,minWidth:80}}>{o.customer_phone||o.customerInfo?.phone||'-'}</span>
                  <span style={{fontWeight:600,fontSize:12,minWidth:140}}>{o.product_name||o.product?.name||'-'}</span>
                  <span style={{fontWeight:700,fontSize:13,minWidth:80}}>{o.total||0} MKD</span>
                  <span style={{background:statusBg(o.status),color:statusColor(o.status),padding:'3px 10px',fontSize:10,fontWeight:700,textTransform:'uppercase',borderRadius:2}}>{o.status||'Pending'}</span>
                  <span style={{color:'#CCC',fontSize:16}}>{selectedOrder?.id===o.id?'▾':'▸'}</span>
                </div>
                {/* Expanded Detail */}
                {selectedOrder?.id===o.id&&(
                  <div style={{borderTop:'1px solid #F0F0F0',padding:'16px 20px',background:'#FAFAFA',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12}}>
                    <div><p style={{fontSize:9,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:'#999',margin:'0 0 4px'}}>Customer</p><p style={{fontSize:12,fontWeight:600,margin:0}}>{o.customer_name||o.customerInfo?.fullName||'-'}</p></div>
                    <div><p style={{fontSize:9,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:'#999',margin:'0 0 4px'}}>Phone</p><p style={{fontSize:12,margin:0}}>{o.customer_phone||o.customerInfo?.phone||'-'}</p></div>
                    <div><p style={{fontSize:9,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:'#999',margin:'0 0 4px'}}>Email</p><p style={{fontSize:12,margin:0}}>{o.customer_email||o.customerInfo?.email||'-'}</p></div>
                    <div><p style={{fontSize:9,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:'#999',margin:'0 0 4px'}}>City</p><p style={{fontSize:12,margin:0}}>{o.customer_city||o.customerInfo?.city||'-'}</p></div>
                    <div><p style={{fontSize:9,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:'#999',margin:'0 0 4px'}}>Address</p><p style={{fontSize:12,margin:0}}>{o.customer_address||o.customerInfo?.address||'-'}</p></div>
                    <div><p style={{fontSize:9,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:'#999',margin:'0 0 4px'}}>SKU</p><p style={{fontSize:12,margin:0,color:'#999'}}>{o.product_sku||o.product?.sku||'-'}</p></div>
                    <div><p style={{fontSize:9,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:'#999',margin:'0 0 4px'}}>Size</p><p style={{fontSize:12,margin:0}}>{o.size||'-'}</p></div>
                    <div><p style={{fontSize:9,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:'#999',margin:'0 0 4px'}}>Quantity</p><p style={{fontSize:12,margin:0}}>{o.quantity||1}</p></div>
                    <div><p style={{fontSize:9,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:'#999',margin:'0 0 4px'}}>Card</p><p style={{fontSize:12,margin:0}}>{o.card_last4||o.cardLast4?'****'+(o.card_last4||o.cardLast4):'-'}</p></div>
                    <div style={{gridColumn:'1/-1',display:'flex',gap:8,marginTop:4}}>
                      {o.status==='pending'&&<button onClick={(e)=>{e.stopPropagation();updateStatus(o.id,'shipped')}} style={{background:'#000',color:'#FFF',border:'none',padding:'6px 16px',fontSize:10,fontWeight:700,textTransform:'uppercase',cursor:'pointer',fontFamily:'Inter, sans-serif',borderRadius:2}}>Mark Shipped</button>}
                      {o.status==='shipped'&&<button onClick={(e)=>{e.stopPropagation();updateStatus(o.id,'delivered')}} style={{background:'#2563EB',color:'#FFF',border:'none',padding:'6px 16px',fontSize:10,fontWeight:700,textTransform:'uppercase',cursor:'pointer',fontFamily:'Inter, sans-serif',borderRadius:2}}>Mark Delivered</button>}
                      {o.status==='delivered'&&<span style={{color:'#16A34A',fontSize:11,fontWeight:700}}>✓ Delivered</span>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
