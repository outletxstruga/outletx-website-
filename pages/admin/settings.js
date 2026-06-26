import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminSettings() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    phone: '+389 70 123 456',
    instagram: '@outletxstruga',
    deliveryFee: 150,
    freeDeliveryOver: 3000,
    openingHours: {
      monFri: '09:00 - 21:00',
      sat: '09:00 - 22:00',
      sun: '10:00 - 20:00',
    },
    address: 'Dua Mall, Struga',
    country: 'North Macedonia',
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    setAuthorized(true);
    const saved = localStorage.getItem('outletx_settings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    localStorage.setItem('outletx_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = () => {
    if (newPassword.length < 4) return alert('Password must be at least 4 characters');
    if (newPassword !== confirmPassword) return alert('Passwords do not match');
    localStorage.setItem('outletx_admin_password', newPassword);
    setPasswordChanged(true);
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordChanged(false), 2000);
  };

  const handleLogout = () => { localStorage.removeItem('admin_token'); router.push('/admin/login'); };
  if (!authorized) return null;

  const IS = { width: '100%', padding: '10px 14px', border: '1px solid #E5E5E5', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' };
  const LS = { display: 'block', fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#999', marginBottom: 6 };

  return (
    <>
      <Head><title>Settings | OUTLETX Admin</title></Head>
      <div style={{minHeight: '100vh', background: '#F5F5F5', fontFamily: 'Inter, sans-serif'}}>
        <div style={{background: '#000000', color: '#FFFFFF', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 900, margin: 0}}>OUTLET<span style={{color: '#DC2626'}}>X</span> <span style={{color: '#888', fontSize: 12, fontWeight: 400}}>Settings</span></h1>
          <div style={{display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap'}}>
            <a href="/admin" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Dashboard</a>
            <a href="/admin/products" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Products</a>
            <a href="/admin/orders" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Orders</a>
            <button onClick={handleLogout} style={{background: '#DC2626', color: '#FFF', border: 'none', fontSize: 11, fontWeight: 700, padding: '7px 14px', cursor: 'pointer'}}>Logout</button>
          </div>
        </div>

        <div style={{maxWidth: 900, margin: '0 auto', padding: '24px'}}>
          {/* Store Info */}
          <div style={{background: '#FFF', padding: 24, marginBottom: 20, border: '1px solid #F0F0F0'}}>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 20}}>Store Information</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 14}}>
              <div><label style={LS}>Phone Number</label><input value={settings.phone} onChange={(e) => setSettings({...settings, phone: e.target.value})} style={IS} /></div>
              <div><label style={LS}>Instagram</label><input value={settings.instagram} onChange={(e) => setSettings({...settings, instagram: e.target.value})} style={IS} /></div>
              <div><label style={LS}>Address</label><input value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} style={IS} /></div>
              <div><label style={LS}>Country</label><input value={settings.country} onChange={(e) => setSettings({...settings, country: e.target.value})} style={IS} /></div>
              <div><label style={LS}>Delivery Fee (MKD)</label><input type="number" value={settings.deliveryFee} onChange={(e) => setSettings({...settings, deliveryFee: parseInt(e.target.value) || 0})} style={IS} /></div>
              <div><label style={LS}>Free Delivery Over (MKD)</label><input type="number" value={settings.freeDeliveryOver} onChange={(e) => setSettings({...settings, freeDeliveryOver: parseInt(e.target.value) || 0})} style={IS} /></div>
            </div>
          </div>

          {/* Opening Hours */}
          <div style={{background: '#FFF', padding: 24, marginBottom: 20, border: '1px solid #F0F0F0'}}>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 20}}>Opening Hours</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14}}>
              <div><label style={LS}>Mon - Fri</label><input value={settings.openingHours.monFri} onChange={(e) => setSettings({...settings, openingHours: {...settings.openingHours, monFri: e.target.value}})} style={IS} /></div>
              <div><label style={LS}>Saturday</label><input value={settings.openingHours.sat} onChange={(e) => setSettings({...settings, openingHours: {...settings.openingHours, sat: e.target.value}})} style={IS} /></div>
              <div><label style={LS}>Sunday</label><input value={settings.openingHours.sun} onChange={(e) => setSettings({...settings, openingHours: {...settings.openingHours, sun: e.target.value}})} style={IS} /></div>
            </div>
          </div>

          {/* Change Password */}
          <div style={{background: '#FFF', padding: 24, marginBottom: 20, border: '1px solid #F0F0F0'}}>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 20}}>Change Password</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14}}>
              <div><label style={LS}>New Password</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={IS} /></div>
              <div><label style={LS}>Confirm Password</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={IS} /></div>
            </div>
            <button onClick={handlePasswordChange} style={{marginTop: 14, background: '#000', color: '#FFF', border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '10px 24px', cursor: 'pointer'}}>Change Password</button>
            {passwordChanged && <span style={{color: '#16A34A', fontSize: 12, fontWeight: 700, marginLeft: 12}}>Password updated!</span>}
          </div>

          {/* Save */}
          <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <button onClick={handleSave} style={{background: '#DC2626', color: '#FFF', border: 'none', fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '14px 36px', cursor: 'pointer'}}>Save All Settings</button>
            {saved && <span style={{color: '#16A34A', fontSize: 13, fontWeight: 700}}>Settings saved!</span>}
          </div>
        </div>
      </div>
    </>
  );
}
