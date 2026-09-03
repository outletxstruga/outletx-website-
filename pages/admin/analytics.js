import SiteLink from '../../components/SiteLink';
import {useEffect,useMemo,useState} from 'react';
import AdminLayout,{EmptyState,StatCard} from '../../components/admin/AdminLayout';
import {groupOrderRows} from '../../lib/orderGroups';

const money=value=>`${Number(value||0).toLocaleString('en-US')} MKD`;
const rankingStyle={display:'grid',gridTemplateColumns:'30px 1fr auto',gap:10,alignItems:'center',padding:'12px 0',borderBottom:'1px solid #eee'};
const rowStyle={display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid #eee',fontSize:12};

export default function AdminAnalytics(){
 const [orderRows,setOrderRows]=useState([]),[products,setProducts]=useState([]),[error,setError]=useState('');
 useEffect(()=>{Promise.all([fetch('/api/orders'),fetch('/api/admin/products')]).then(async([ordersResponse,productsResponse])=>{
  if(!ordersResponse.ok||!productsResponse.ok)throw new Error();
  return [await ordersResponse.json(),await productsResponse.json()];
 }).then(([ordersData,productsData])=>{setOrderRows(Array.isArray(ordersData)?ordersData:[]);setProducts(Array.isArray(productsData)?productsData:[]);}).catch(()=>setError('Analytics could not be loaded. Refresh and try again.'));},[]);
 const stats=useMemo(()=>{
  const grouped=groupOrderRows(orderRows),valid=grouped.filter(order=>order.status!=='cancelled');
  const revenue=valid.reduce((sum,order)=>sum+Number(order.total||0),0),byProduct={},byCity={};
  valid.flatMap(order=>order.items).forEach(line=>{const key=line.product_name||'Unknown';byProduct[key]=(byProduct[key]||0)+Number(line.quantity||1);});
  valid.forEach(order=>{const key=order.customer_city||'Unknown';byCity[key]=(byCity[key]||0)+1;});
  return {grouped,valid,revenue,average:valid.length?revenue/valid.length:0,top:Object.entries(byProduct).sort((a,b)=>b[1]-a[1]),cities:Object.entries(byCity).sort((a,b)=>b[1]-a[1])};
 },[orderRows]);
 const catalogueValue=products.reduce((sum,product)=>sum+Number(product.newPrice||0)*(product.sizes||[]).reduce((quantity,size)=>quantity+Number(size.stock||0),0),0);
 return <AdminLayout title="Analytics" action={<SiteLink className="admin-button secondary" href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">Open Google Analytics ↗</SiteLink>}>
  {error&&<div className="admin-alert">{error}</div>}
  <div className="admin-grid-stats"><StatCard label="Sales value" value={money(stats.revenue)} detail="All non-cancelled orders" tone="green"/><StatCard label="Average order" value={money(stats.average)} detail="Average non-cancelled order"/><StatCard label="Order success" value={`${stats.grouped.length?Math.round(stats.valid.length/stats.grouped.length*100):0}%`} detail="Orders not cancelled"/><StatCard label="Catalogue value" value={money(catalogueValue)} detail="Retail value of current stock" tone="red"/></div>
  <div className="admin-split"><section className="admin-panel"><div className="admin-panel-head"><div><h2>Best-selling products</h2><p>Based on recorded orders</p></div></div>{stats.top.length?<div style={{padding:18}}>{stats.top.slice(0,8).map(([name,count],index)=><div key={name} style={rankingStyle}><strong style={{color:'#bbb'}}>{String(index+1).padStart(2,'0')}</strong><span style={{fontSize:12,fontWeight:800,textTransform:'uppercase'}}>{name}</span><b>{count} sold</b></div>)}</div>:<EmptyState title="No sales data" text="Product performance will appear after orders are recorded."/>}</section>
  <section className="admin-panel"><div className="admin-panel-head"><div><h2>Top delivery cities</h2><p>Where customers order from</p></div></div>{stats.cities.length?<div style={{padding:18}}>{stats.cities.slice(0,8).map(([city,count])=><div key={city} style={rowStyle}><strong>{city}</strong><span>{count} {count===1?'order':'orders'}</span></div>)}</div>:<EmptyState title="No city data" text="Delivery locations will appear with customer orders."/>}</section></div>
  <div className="admin-alert admin-success">Sales figures above come from recorded store orders. Website visitors, traffic sources and live users are available in Google Analytics.</div>
 </AdminLayout>;
}
