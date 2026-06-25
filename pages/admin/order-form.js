import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import * as XLSX from 'xlsx';

export default function OrderForm() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState([{ sku: '', gender: 'Men' }]);
  const [distributor, setDistributor] = useState({ name: '', email: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    setAuthorized(true);
  }, []);

  if (!authorized) return null;

  const sizeQuantities = {
    Men: [
      { size: '40', qty: 2 }, { size: '40.5', qty: 2 }, { size: '41', qty: 2 },
      { size: '42', qty: 2 }, { size: '42.5', qty: 2 }, { size: '43', qty: 3 },
      { size: '44', qty: 2 }, { size: '44.5', qty: 2 }, { size: '45', qty: 1 },
      { size: '46', qty: 1 },
    ],
    Women: [
      { size: '35', qty: 1 }, { size: '36', qty: 2 }, { size: '36.5', qty: 2 },
      { size: '37', qty: 3 }, { size: '38', qty: 2 }, { size: '38.5', qty: 2 },
      { size: '39', qty: 3 }, { size: '40', qty: 1 }, { size: '40.5', qty: 1 },
    ],
  };

  const addRow = () => setOrders([...orders, { sku: '', gender: 'Men' }]);
  const removeRow = (index) => setOrders(orders.filter((_, i) => i !== index));
  const updateRow = (index, field, value) => {
    const updated = [...orders];
    updated[index][field] = value;
    setOrders(updated);
  };

  const generateExcel = () => {
    const validOrders = orders.filter(o => o.sku);

    // Generate all rows with sizes
    const allRows = [];
    let rowNum = 1;

    validOrders.forEach(order => {
      const sizes = sizeQuantities[order.gender] || [];
      sizes.forEach(s => {
        allRows.push({
          'No.': rowNum,
          'SKU / Code': order.sku,
          'Gender': order.gender,
          'Size': s.size,
          'Quantity': s.qty,
        });
        rowNum++;
      });
    });

    // Add empty rows between different SKUs
    const finalData = [];
    let lastSku = '';
    allRows.forEach(row => {
      if (lastSku && row['SKU / Code'] !== lastSku) {
        finalData.push({ 'No.': '', 'SKU / Code': '', 'Gender': '', 'Size': '', 'Quantity': '' });
      }
      finalData.push(row);
      lastSku = row['SKU / Code'];
    });

    // Add summary at the bottom
    const totalItems = finalData.filter(r => r['SKU / Code']).reduce((sum, r) => sum + (r.Quantity || 0), 0);
    finalData.push({ 'No.': '', 'SKU / Code': '', 'Gender': '', 'Size': '', 'Quantity': '' });
    finalData.push({ 'No.': '', 'SKU / Code': 'TOTAL PAIRS', 'Gender': '', 'Size': '', 'Quantity': totalItems });

    const ws = XLSX.utils.json_to_sheet(finalData);
    ws['!cols'] = [{ wch: 6 }, { wch: 22 }, { wch: 10 }, { wch: 8 }, { wch: 10 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Order');

    const fileName = `OUTLETX_Order_${distributor.date}_${distributor.name.replace(/\s/g, '_') || 'distributor'}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #E5E5E5', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' };

  return (
    <>
      <Head><title>Order Form | OUTLETX</title></Head>
      <div style={{minHeight: '100vh', background: '#F5F5F5', fontFamily: 'Inter, sans-serif'}}>
        <div style={{background: '#000000', color: '#FFFFFF', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '900', margin: 0}}>
            OUTLET<span style={{color: '#DC2626'}}>X</span> <span style={{color: '#888888', fontSize: '14px', fontWeight: '400'}}>Order Form</span>
          </h1>
          <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <a href="/admin" style={{color: '#FFFFFF', textDecoration: 'none', fontSize: '13px', fontWeight: '600'}}>Dashboard</a>
            <a href="/admin/products" style={{color: '#FFFFFF', textDecoration: 'none', fontSize: '13px', fontWeight: '600'}}>Products</a>
          </div>
        </div>

        <div style={{maxWidth: '900px', margin: '40px auto', padding: '0 40px'}}>
          {/* Distributor Info */}
          <div style={{background: '#FFFFFF', padding: '24px', marginBottom: '24px'}}>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '16px'}}>Distributor</h2>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
              <div>
                <label style={{display: 'block', fontWeight: '700', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: '#999', marginBottom: '6px'}}>Name</label>
                <input style={inputStyle} value={distributor.name} onChange={(e) => setDistributor({...distributor, name: e.target.value})} placeholder="Nike / Adidas / Puma..." />
              </div>
              <div>
                <label style={{display: 'block', fontWeight: '700', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: '#999', marginBottom: '6px'}}>Email</label>
                <input style={inputStyle} value={distributor.email} onChange={(e) => setDistributor({...distributor, email: e.target.value})} placeholder="orders@distributor.com" />
              </div>
              <div>
                <label style={{display: 'block', fontWeight: '700', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: '#999', marginBottom: '6px'}}>Date</label>
                <input type="date" style={inputStyle} value={distributor.date} onChange={(e) => setDistributor({...distributor, date: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div style={{background: '#FFFFFF', padding: '24px', marginBottom: '24px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', margin: 0}}>SKU List ({orders.length})</h2>
              <button onClick={addRow} style={{background: '#000000', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: '700', padding: '10px 20px', cursor: 'pointer'}}>+ Add SKU</button>
            </div>

            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #000000'}}>
                  <th style={{textAlign: 'left', padding: '10px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px', width: '40px'}}>#</th>
                  <th style={{textAlign: 'left', padding: '10px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>SKU / Code *</th>
                  <th style={{textAlign: 'left', padding: '10px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Gender *</th>
                  <th style={{textAlign: 'left', padding: '10px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Sizes Generated</th>
                  <th style={{textAlign: 'left', padding: '10px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Total Pairs</th>
                  <th style={{width: '50px'}}></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((row, i) => {
                  const sizes = sizeQuantities[row.gender] || [];
                  const totalPairs = sizes.reduce((sum, s) => sum + s.qty, 0);
                  return (
                    <tr key={i} style={{borderBottom: '1px solid #F0F0F0'}}>
                      <td style={{padding: '8px', color: '#999', fontSize: '12px'}}>{i + 1}</td>
                      <td style={{padding: '8px'}}>
                        <input required style={inputStyle} value={row.sku} onChange={(e) => updateRow(i, 'sku', e.target.value)} placeholder="IH4444" />
                      </td>
                      <td style={{padding: '8px'}}>
                        <select required style={inputStyle} value={row.gender} onChange={(e) => updateRow(i, 'gender', e.target.value)}>
                          <option value="Men">Men</option>
                          <option value="Women">Women</option>
                        </select>
                      </td>
                      <td style={{padding: '8px', color: '#666', fontSize: '11px'}}>
                        {sizes.map(s => `${s.size}(${s.qty})`).join(', ')}
                      </td>
                      <td style={{padding: '8px', fontWeight: '700', color: '#DC2626'}}>{totalPairs} pairs</td>
                      <td style={{padding: '8px'}}>
                        {orders.length > 1 && (
                          <button onClick={() => removeRow(i)} style={{background: '#DC2626', color: '#FFF', border: 'none', fontSize: '18px', cursor: 'pointer', width: '30px', height: '30px'}}>&times;</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Preview */}
            {orders.some(o => o.sku) && (
              <div style={{marginTop: '24px', padding: '16px', background: '#F9F9F9'}}>
                <p style={{fontWeight: '700', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: '#999', marginBottom: '8px'}}>Excel Preview</p>
                <p style={{fontSize: '13px', color: '#555', lineHeight: '1.8'}}>
                  {orders.filter(o => o.sku).map(o => {
                    const sizes = sizeQuantities[o.gender] || [];
                    const total = sizes.reduce((s, sz) => s + sz.qty, 0);
                    return `${o.sku} (${o.gender}): ${total} pairs across ${sizes.length} sizes`;
                  }).join(' | ')}
                </p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
            <button onClick={addRow} style={{background: 'transparent', color: '#000', border: '1px solid #E5E5E5', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', padding: '14px 28px', cursor: 'pointer'}}>+ Add SKU</button>
            <button onClick={generateExcel} style={{background: '#DC2626', color: '#FFF', border: 'none', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', padding: '14px 28px', cursor: 'pointer'}}>Download Excel</button>
          </div>
        </div>
      </div>
    </>
  );
}
