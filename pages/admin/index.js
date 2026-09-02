import { useEffect, useMemo, useState } from 'react';
import AdminLayout, { EmptyState, StatCard, StatusBadge } from '../../components/admin/AdminLayout';

const money = (value) => `${Number(value || 0).toLocaleString('en-US')} MKD`;
const dateText = (value) => value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [productResponse, orderResponse] = await Promise.all([fetch('/api/admin/products'), fetch('/api/orders')]);
      if (orderResponse.status === 401) return;
      const productData = await productResponse.json();
      const orderData = await orderResponse.json();
      setProducts(Array.isArray(productData) ? productData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch { setError('The dashboard could not load the latest data. Refresh the page to try again.'); }
  };

  useEffect(() => { load(); }, []);

  const metrics = useMemo(() => {
    const pending = orders.filter((order) => ['pending', 'confirmed', 'processing'].includes(order.status || 'pending'));
    const revenue = orders.filter((order) => order.status !== 'cancelled').reduce((sum, order) => sum + Number(order.total || 0), 0);
    const stock = products.reduce((sum, product) => sum + (product.sizes || []).reduce((qty, size) => qty + Number(size.stock || 0), 0), 0);
    const lowStock = products.filter((product) => {
      const qty = (product.sizes || []).reduce((sum, size) => sum + Number(size.stock || 0), 0);
      return qty <= 5;
    });
    return { pending, revenue, stock, lowStock };
  }, [orders, products]);

  return (
    <AdminLayout title="Overview" action={<a className="admin-button red" href="/admin/products">+ Add product</a>}>
      {error && <div className="admin-alert">{error}</div>}
      <section className="admin-grid-stats">
        <StatCard label="Orders to handle" value={metrics.pending.length} detail="Pending or in progress" tone="orange" />
        <StatCard label="Total sales" value={money(metrics.revenue)} detail={`${orders.length} orders recorded`} tone="green" />
        <StatCard label="Products" value={products.length} detail={`${metrics.stock} units in stock`} />
        <StatCard label="Low stock" value={metrics.lowStock.length} detail="Products with 5 units or fewer" tone="red" />
      </section>

      <div className="admin-split">
        <section className="admin-panel">
          <div className="admin-panel-head"><div><h2>Recent orders</h2><p>Your latest customer orders</p></div><a href="/admin/orders" className="admin-button secondary">View all</a></div>
          {orders.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>
            {orders.slice(0, 6).map((order) => <tr key={order.id}><td><strong>#{order.id}</strong><br/><small>{order.product_name || 'Product'}</small></td><td>{order.customer_name || '—'}<br/><small>{order.customer_city || ''}</small></td><td><strong>{money(order.total)}</strong></td><td><StatusBadge status={order.status}/></td><td>{dateText(order.created_at)}</td></tr>)}
          </tbody></table></div> : <EmptyState title="No orders yet" text="New customer orders will appear here automatically." />}
        </section>

        <section className="admin-panel">
          <div className="admin-panel-head"><div><h2>Stock attention</h2><p>Items that may need restocking</p></div></div>
          {metrics.lowStock.length ? <div style={{padding:12}}>{metrics.lowStock.slice(0, 7).map((product) => {
            const qty = (product.sizes || []).reduce((sum, size) => sum + Number(size.stock || 0), 0);
            return <a href={`/admin/products?search=${encodeURIComponent(product.sku || product.name)}`} key={product.id} style={{display:'flex',alignItems:'center',gap:12,padding:10,textDecoration:'none',color:'#171717',borderBottom:'1px solid #eee'}}><img src={product.images?.[0]} alt="" style={{width:44,height:44,objectFit:'contain',background:'#f4f4f4'}}/><span style={{flex:1,fontSize:11}}><b style={{display:'block',textTransform:'uppercase'}}>{product.name}</b><small style={{color:'#888'}}>{product.brand} · {product.sku}</small></span><strong style={{color:qty === 0 ? '#c82027' : '#e47a19'}}>{qty}</strong></a>;
          })}</div> : <EmptyState title="Stock looks healthy" text="No products are currently below the low-stock threshold." />}
        </section>
      </div>

      <section className="admin-card-grid">
        <a className="admin-card" href="/admin/orders" style={{textDecoration:'none',color:'#171717'}}><b>Process orders</b><p style={{color:'#777',fontSize:12,lineHeight:1.6}}>Confirm, ship, and complete customer orders.</p><span style={{color:'#e31b23',fontSize:11,fontWeight:800}}>Open orders →</span></a>
        <a className="admin-card" href="/admin/products" style={{textDecoration:'none',color:'#171717'}}><b>Manage inventory</b><p style={{color:'#777',fontSize:12,lineHeight:1.6}}>Add products, images, sizes, prices, and stock.</p><span style={{color:'#e31b23',fontSize:11,fontWeight:800}}>Open products →</span></a>
        <a className="admin-card" href="/admin/slider" style={{textDecoration:'none',color:'#171717'}}><b>Update homepage</b><p style={{color:'#777',fontSize:12,lineHeight:1.6}}>Control the promotional slides customers see first.</p><span style={{color:'#e31b23',fontSize:11,fontWeight:800}}>Edit homepage →</span></a>
      </section>
    </AdminLayout>
  );
}
