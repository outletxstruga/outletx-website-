import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import * as XLSX from 'xlsx';

export default function OrderForm() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState([{ sku: '', gender: 'Men', type: 'Shoes' }]);
  const [distributor, setDistributor] = useState({ name: '', email: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    setAuthorized(true);
  }, []);

  if (!authorized) return null;

  const sizeQuantities = {
    Shoes: {
      Men: [
        { size: '40', qty: 2 }, { size: '40.5', qty: 2 }, { size: '41', qty: 2 },
        { size: '42', qty: 2 }, { size: '42.5', qty: 2 }, { size: '43', qty: 3 },
        { size: '44', qty: 2 }, { size: '44.5', qty: 2 }, { size: '45', qty: 1 }, { size: '46', qty: 1 },
      ],
      Women: [
        { size: '35', qty: 1 }, { size: '36', qty: 2 }, { size: '36.5', qty: 2 },
        { size: '37', qty: 3 }, { size: '38', qty: 2 }, { size: '38.5', qty: 2 },
        { size: '39', qty: 3 }, { size: '40', qty: 1 }, { size: '40.5', qty: 1 },
      ],
      Kids: [
        { size: '28', qty: 2 }, { size: '29', qty: 2 }, { size: '30', qty: 3 },
        { size: '31', qty: 3 }, { size: '32', qty: 3 }, { size: '33', qty: 2 },
        { size: '34', qty: 2 }, { size: '35', qty: 1 },
      ],
    },
    Clothing: {
      Men: [
        { size: 'S', qty: 3 }, { size: 'M', qty: 4 }, { size: 'L', qty: 4 },
        { size: 'XL', qty: 3 }, { size: 'XXL', qty: 2 },
      ],
      Women: [
        { size: 'XS', qty: 2 }, { size: 'S', qty: 3 }, { size: 'M', qty: 4 },
        { size: 'L', qty: 3 }, { size: 'XL', qty: 2 },
      ],
      Kids: [
        { size: '104', qty: 2 }, { size: '110', qty: 3 }, { size: '116', qty: 3 },
        { size: '122', qty: 3 }, { size: '128', qty: 2 }, { size: '134', qty: 2 },
        { size: '140', qty: 2 }, { size: '152', qty: 1 },
      ],
    },
  };

  const addRow = () => setOrders([...orders, { sku: '', gender: 'Men', type: 'Shoes' }]);
  const removeRow = (index) => setOrders(orders.filter((_, i) => i !== index));
  const updateRow = (index, field, value) => {
    const updated = [...orders];
    updated[index][field] = value;
    setOrders(updated);
  };

  const generateExcel = () => {
    const validOrders = orders.filter(o => o.sku);
    const allRows = [];
    let rowNum = 1;

    validOrders.forEach(order => {
      const sizes = sizeQuantities[order.type]?.[order.gender] || [];
      sizes.forEach(s => {
        allRows.push({
          'No.': rowNum,
          'SKU / Code': order.sku,
          'Type': order.type,
          'Gender': order.gender,
          'Size': s.size,
          'Quantity': s.qty,
        });
        rowNum++;
      });
    });

    const finalData = [];
    let lastSku = '';
    allRows.forEach(row => {
      if (lastSku && row['SKU / Code'] !== lastSku) {
        finalData.push({ 'No.': '', 'SKU / Code': '', 'Type': '', 'Gender': '', 'Size': '', 'Quantity': '' });
      }
      finalData.push(row);
      lastSku = row['SKU / Code'];
    });

    const totalItems = finalData.filter(r => r['SKU / Code']).reduce((sum, r) => sum + (r.Quantity || 0), 0);
    finalData.push({ 'No.': '', 'SKU / Code': '', 'Type': '', 'Gender': '', 'Size': '', 'Quantity': '' });
    finalData.push({ 'No.': '', 'SKU / Code': 'TOTAL ITEMS', 'Type': '', 'Gender': '', 'Size': '', 'Quantity': totalItems });

    const ws = XLSX.utils.json_to_sheet(finalData);
    ws['!cols'] = [{ wch: 6 }, { wch: 22 }, { wch: 10 }, { wch: 10 }, { wch: 8 }, { wch: 10 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Order');

    const fileName = `OUTLETX_Order_${distributor.date}_${distributor.name.replace(/\s/g, '_') || 'distributor'}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handleLogout = () => { localStorage.removeItem('admin_token'); router.push('/admin/login'); };

  const IS = { width: '100%', padding: 10, border: '1px solid #E5E5E5', fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' };
  const LS = { display: 'block', fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#999', marginBottom: 4 };

  return (
    <>
      <Head><title>Order Form | OUTLETX Admin</title></Head>
      <div style={{minHeight:'100vh',background:'#F8F8F8',fontFamily:'Inter, sans-serif'}}>
        <div style={{background:'#FFF',borderBottom:'1px solid #EEE',padding:'0 32px',height:60,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:32}}>
            <h1 style={{fontFamily:'Montserrat, sans-serif',fontSize:16,fontWeight:900,letterSpacing:-0.5,margin:0}}>OUTLET<span style={{color:'#DC2626'}}>X</span></h1>
            <nav style={{display:'flex',gap:24}}>
              <a href="/admin" style={{color:'#888',textDecoration:'none',fontSize:12,fontWeight:600}}>Dashboard</a>
              <a href="/admin/products" style={{color:'#888',textDecoration:'none',fontSize:12,fontWeight:600}}>Products</a>
              <a href="/admin/orders" style={{color:'#888',textDecoration:'none',fontSize:12,fontWeight:600}}>Orders</a>
              <a href="/admin/order-form" style={{color:'#000',textDecoration:'none',fontSize:12,fontWeight:700}}>Order Form</a>
            </nav>
          </div>
          <button onClick={handleLogout} style={{background:'#000',color:'#FFF',border:'none',fontSize:10,fontWeight:700,letterSpacing:1,textTransform:'uppercase',padding:'7px 14px',cursor:'pointer',fontFamily:'Inter, sans-serif',borderRadius:2}}>Logout</button>
        </div>

        <div style={{maxWidth:1100,margin:'0 auto',padding:'28px 24px'}}>
          <div style={{background:'#FFF',padding:24,marginBottom:20,border:'1px solid #F0F0F0',borderRadius:2}}>
            <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:15,fontWeight:900,letterSpacing:-0.5,textTransform:'uppercase',marginBottom:20}}>Distributor Information</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14}}>
              <div><label style={LS}>Distributor Name</label><input style={IS} value={distributor.name} onChange={e=>setDistributor({...distributor,name:e.target.value})} placeholder="Nike / Adidas / Puma..." /></div>
              <div><label style={LS}>Email</label><input style={IS} value={distributor.email} onChange={e=>setDistributor({...distributor,email:e.target.value})} placeholder="orders@distributor.com" /></div>
              <div><label style={LS}>Order Date</label><input type="date" style={IS} value={distributor.date} onChange={e=>setDistributor({...distributor,date:e.target.value})} /></div>
            </div>
          </div>

          <div style={{background:'#FFF',padding:24,marginBottom:20,border:'1px solid #F0F0F0',borderRadius:2}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:15,fontWeight:900,letterSpacing:-0.5,textTransform:'uppercase',margin:0}}>SKU List ({orders.length})</h2>
              <button onClick={addRow} style={{background:'#DC2626',color:'#FFF',border:'none',fontSize:10,fontWeight:700,letterSpacing:1,textTransform:'uppercase',padding:'8px 16px',cursor:'pointer',fontFamily:'Inter, sans-serif',borderRadius:2}}>+ Add SKU</button>
            </div>

            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,minWidth:700}}>
                <thead>
                  <tr style={{borderBottom:'2px solid #000'}}>
                    <th style={th}>#</th>
                    <th style={th}>SKU / Code *</th>
                    <th style={th}>Type *</th>
                    <th style={th}>Gender *</th>
                    <th style={th}>Sizes Generated</th>
                    <th style={th}>Total</th>
                    <th style={{width:40}}></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((row, i) => {
                    const sizes = sizeQuantities[row.type]?.[row.gender] || [];
                    const totalItems = sizes.reduce((sum, s) => sum + s.qty, 0);
                    return (
                      <tr key={i} style={{borderBottom:'1px solid #F0F0F0'}}>
                        <td style={{...td,color:'#999'}}>{i + 1}</td>
                        <td style={td}><input required style={IS} value={row.sku} onChange={e=>updateRow(i,'sku',e.target.value)} placeholder="IH4444" /></td>
                        <td style={td}>
                          <select style={IS} value={row.type} onChange={e=>updateRow(i,'type',e.target.value)}>
                            <option value="Shoes">Shoes</option>
                            <option value="Clothing">Clothing</option>
                          </select>
                        </td>
                        <td style={td}>
                          <select style={IS} value={row.gender} onChange={e=>updateRow(i,'gender',e.target.value)}>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Kids">Kids</option>
                          </select>
                        </td>
                        <td style={{...td,color:'#666',fontSize:10}}>
                          {sizes.map(s => `${s.size}(${s.qty})`).join(', ')}
                        </td>
                        <td style={{...td,fontWeight:700,color:'#DC2626'}}>{totalItems}</td>
                        <td style={td}>
                          {orders.length>1&&<button onClick={()=>removeRow(i)} style={{background:'#DC2626',color:'#FFF',border:'none',fontSize:16,cursor:'pointer',width:26,height:26,borderRadius:2,lineHeight:1}}>&times;</button>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {orders.some(o=>o.sku)&&(
              <div style={{marginTop:20,padding:16,background:'#FAFAFA',borderRadius:2}}>
                <p style={{fontWeight:700,fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'#999',marginBottom:8}}>Excel Preview</p>
                <div style={{fontSize:12,color:'#555',lineHeight:1.8}}>
                  {orders.filter(o=>o.sku).map(o=>{
                    const sizes = sizeQuantities[o.type]?.[o.gender]||[];
                    const total = sizes.reduce((s,sz)=>s+sz.qty,0);
                    return <p key={o.sku} style={{margin:'0 0 4px'}}>{o.sku} ({o.type} - {o.gender}): <strong>{total} items</strong> across {sizes.length} sizes</p>;
                  })}
                </div>
              </div>
            )}
          </div>

          <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
            <button onClick={addRow} style={{background:'#FFF',color:'#000',border:'1px solid #E5E5E5',fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',padding:'12px 24px',cursor:'pointer',fontFamily:'Inter, sans-serif',borderRadius:2}}>+ Add SKU</button>
            <button onClick={generateExcel} style={{background:'#DC2626',color:'#FFF',border:'none',fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',padding:'12px 24px',cursor:'pointer',fontFamily:'Inter, sans-serif',borderRadius:2}}>Download Excel</button>
          </div>
        </div>
      </div>
    </>
  );
}

const th = { textAlign:'left',padding:'8px 6px',fontWeight:700,textTransform:'uppercase',fontSize:9,letterSpacing:1,whiteSpace:'nowrap' };
const td = { padding:'8px 6px',whiteSpace:'nowrap' };