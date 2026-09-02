import { useState } from 'react';

export default function SizeGuide({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300,
        backdropFilter: 'blur(2px)',
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: '#FFF', zIndex: 301, width: '90%', maxWidth: 700, maxHeight: '85vh',
        overflow: 'auto', padding: 0, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        fontFamily: 'Inter, sans-serif',
      }}>
        {/* Header */}
        <div style={{
          background: '#000', color: '#FFF', padding: '16px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 1,
        }}>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase', margin: 0 }}>
            Size Guide
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#FFF', fontSize: 22, cursor: 'pointer', padding: '4px 8px',
          }}>&times;</button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Men Shoes */}
          <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 900, textTransform: 'uppercase', marginBottom: 12 }}>
            Men's Shoes
          </h3>
          <div style={{ overflowX: 'auto', marginBottom: 28 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  <th style={th}>EU</th>
                  <th style={th}>US</th>
                  <th style={th}>UK</th>
                  <th style={th}>CM</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['40', '7', '6', '25'],
                  ['40.5', '7.5', '6.5', '25.5'],
                  ['41', '8', '7', '26'],
                  ['42', '8.5', '7.5', '26.5'],
                  ['42.5', '9', '8', '27'],
                  ['43', '9.5', '8.5', '27.5'],
                  ['44', '10', '9', '28'],
                  ['44.5', '10.5', '9.5', '28.5'],
                  ['45', '11', '10', '29'],
                  ['46', '12', '11', '30'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '10px 14px', textAlign: 'center', fontWeight: j === 0 ? 700 : 400 }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Women Shoes */}
          <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 900, textTransform: 'uppercase', marginBottom: 12 }}>
            Women's Shoes
          </h3>
          <div style={{ overflowX: 'auto', marginBottom: 28 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  <th style={th}>EU</th>
                  <th style={th}>US</th>
                  <th style={th}>UK</th>
                  <th style={th}>CM</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['35.5', '5', '2.5', '22'],
                  ['36', '5.5', '3', '22.5'],
                  ['36.5', '6', '3.5', '23'],
                  ['37.5', '6.5', '4', '23.5'],
                  ['38', '7', '4.5', '24'],
                  ['38.5', '7.5', '5', '24.5'],
                  ['39', '8', '5.5', '25'],
                  ['40', '8.5', '6', '25.5'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '10px 14px', textAlign: 'center', fontWeight: j === 0 ? 700 : 400 }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clothing */}
          <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 900, textTransform: 'uppercase', marginBottom: 12 }}>
            Clothing
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  <th style={th}>Size</th>
                  <th style={th}>Chest (cm)</th>
                  <th style={th}>Waist (cm)</th>
                  <th style={th}>Hip (cm)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['XS', '82-87', '66-71', '84-89'],
                  ['S', '88-93', '72-77', '90-95'],
                  ['M', '94-99', '78-83', '96-101'],
                  ['L', '100-105', '84-89', '102-107'],
                  ['XL', '106-111', '90-95', '108-113'],
                  ['XXL', '112-117', '96-101', '114-119'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '10px 14px', textAlign: 'center', fontWeight: j === 0 ? 700 : 400 }}>
                        {cell}
                      </td>
                    ))}
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

const th = {
  padding: '12px 14px',
  textAlign: 'center',
  fontWeight: 700,
  fontSize: 10,
  letterSpacing: 1,
  textTransform: 'uppercase',
  color: '#666',
};